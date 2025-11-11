// RGB PSBT Signer Library using bdk-wasm
// Signs both create_utxo_begin and send_begin PSBTs from rgb-lib
// 
// This module provides RGB-specific PSBT signing functionality for:
// - create_utxo_begin PSBTs: Creating UTXOs for RGB wallet operations
// - send_begin PSBTs: Signing RGB asset transfer transactions
//
// Usage:
//   import { signPsbt, signPsbtSync } from './signer';
//   const signedPsbt = signPsbt(mnemonic, psbtBase64, 'testnet');

import { isNode } from '../utils/environment';
import type { BIP32Interface } from 'bip32';
import type { Psbt as BitcoinJsPsbt, Network as BitcoinJsNetwork } from 'bitcoinjs-lib';
import { ValidationError, CryptoError } from '../errors';
import { validateMnemonic, validatePsbt, normalizeNetwork } from '../utils/validation';
import {
  DERIVATION_PURPOSE,
  DERIVATION_ACCOUNT,
  KEYCHAIN_RGB,
  KEYCHAIN_BTC,
  COIN_RGB_TESTNET,
  COIN_RGB_MAINNET,
  COIN_BITCOIN_TESTNET,
  COIN_BITCOIN_MAINNET,
} from '../constants';
import type { 
  Network, 
  PsbtType, 
  NetworkVersions, 
  Descriptors,
  BDKModule,
  BDKInit,
  BIP39Module,
  ECCModule,
  BIP32Factory,
  BitcoinJsPayments,
  BitcoinJsNetworks,
  BIP341Module,
  BDKWallet,
  BDKPsbt,
  BDKNetwork,
  BDKSignOptions
} from './types';
import { calculateMasterFingerprint } from '../utils/fingerprint';
import { getNetworkVersions as getBIP32NetworkVersions, normalizeSeedBuffer } from '../utils/bip32-helpers';

// Dynamic imports for browser compatibility
let bip39: BIP39Module | undefined;
let ecc: ECCModule | undefined;
let BIP32FactoryInstance: BIP32Factory | undefined;
let Psbt: typeof import('bitcoinjs-lib').Psbt | undefined;
let payments: BitcoinJsPayments | undefined;
let networks: BitcoinJsNetworks | undefined;
let toXOnly: ((pubkey: Buffer) => Buffer) | undefined;
let bdk: BDKModule | undefined;
let init: BDKInit | undefined;

function normalizeSeedInput(seed: string | Uint8Array, field: string = 'seed'): Uint8Array {
  if (typeof seed === 'string') {
    const trimmed = seed.trim();
    if (!trimmed) {
      throw new ValidationError(`${field} must be a non-empty hex string`, field);
    }
    const hex = trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;
    if (hex.length !== 128 || !/^[0-9a-fA-F]+$/.test(hex)) {
      throw new ValidationError(`${field} must be a 64-byte hex string`, field);
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      const byte = hex.slice(i * 2, i * 2 + 2);
      bytes[i] = parseInt(byte, 16);
    }
    return bytes;
  }

  if (seed instanceof Uint8Array) {
    if (seed.length === 0) {
      throw new ValidationError(`${field} must not be empty`, field);
    }
    return seed;
  }

  throw new ValidationError(`${field} must be a 64-byte hex string or Uint8Array`, field);
}

// Load dependencies based on environment
async function loadDependencies(): Promise<void> {
  if (isNode()) {
    // Node.js: use @bitcoindevkit/bdk-wallet-node
    const bdkNode = await import('@bitcoindevkit/bdk-wallet-node');
    // BDK packages export init function as default or named export
    init = (bdkNode.default as unknown as BDKInit) || ((bdkNode as { init?: unknown }).init as BDKInit) || (bdkNode as unknown as BDKInit);
    bdk = bdkNode as unknown as BDKModule;
    // Use dynamic import with string concatenation to prevent bundlers from analyzing it
    const nodeModule = 'node:' + 'module';
    const { createRequire } = await import(nodeModule);
    // @ts-ignore - import.meta.url not available in CJS build context
    const requireFromModule = createRequire(import.meta.url);
    bip39 = requireFromModule('bip39') as unknown as BIP39Module;
    ecc = requireFromModule('@bitcoinerlab/secp256k1') as unknown as ECCModule;
    const bip32 = requireFromModule('bip32') as unknown as { BIP32Factory: BIP32Factory };
    BIP32FactoryInstance = bip32.BIP32Factory;
    const bitcoinjs = requireFromModule('bitcoinjs-lib') as unknown as {
      Psbt: typeof import('bitcoinjs-lib').Psbt;
      payments: BitcoinJsPayments;
      networks: BitcoinJsNetworks;
    };
    Psbt = bitcoinjs.Psbt;
    payments = bitcoinjs.payments;
    networks = bitcoinjs.networks;
    const bip341 = requireFromModule('bitcoinjs-lib/src/payments/bip341.js') as unknown as BIP341Module;
    toXOnly = bip341.toXOnly || ((pubkey: Buffer) => Buffer.from(pubkey.slice(1)));
  } else {
    const bdkWeb = await import('@bitcoindevkit/bdk-wallet-web');

    init = ((bdkWeb as { default?: unknown }).default as BDKInit) || ((bdkWeb as { init?: unknown }).init as BDKInit) || (bdkWeb as unknown as BDKInit);
    bdk = bdkWeb as unknown as BDKModule;
    
    // Browser: use ESM imports
    const bip39Module = await import('bip39');
    bip39 = (bip39Module.default as BIP39Module) || (bip39Module as BIP39Module);

    const eccModule = await import('@bitcoinerlab/secp256k1');
   
    if (eccModule.default) {
      ecc = eccModule.default as unknown as ECCModule;
    } else {
      ecc = eccModule as unknown as ECCModule;
    }
    const bip32 = await import('bip32') as unknown as { BIP32Factory: BIP32Factory };
    BIP32FactoryInstance = bip32.BIP32Factory;
    const bitcoinjs = await import('bitcoinjs-lib') as unknown as {
      Psbt: typeof import('bitcoinjs-lib').Psbt;
      payments: BitcoinJsPayments;
      networks: BitcoinJsNetworks;
    };
    Psbt = bitcoinjs.Psbt;
    payments = bitcoinjs.payments;
    networks = bitcoinjs.networks;
    const bip341 = await import('bitcoinjs-lib/src/payments/bip341.js') as unknown as BIP341Module;
    toXOnly = bip341.toXOnly || ((pubkey: Buffer) => Buffer.from(pubkey.slice(1)));
  }
}

// Initialize dependencies immediately in Node.js, lazily in browser
let dependenciesLoaded = false;
if (isNode()) {
  loadDependencies().then(async () => {
    dependenciesLoaded = true;
  }).catch(() => {
    throw new CryptoError('Failed to load dependencies');
  });
}

async function ensureDependencies() {
  if (!dependenciesLoaded) {
    await loadDependencies();    
    dependenciesLoaded = true;
  }
}

// Re-export types from types module
export type { Network, PsbtType, NetworkVersions, Descriptors } from './types';

export interface SignPsbtOptions {
  signOptions?: BDKSignOptions;
  preprocess?: boolean;
}

type DerivationPath = string | number[];

/**
 * Normalize derivation path string
 */
function normalizePath(path: DerivationPath): DerivationPath {
  if (typeof path === 'string') {
    // Remove duplicate m/ prefixes
    if (path.startsWith('m/m/')) {
      return path.replace(/^m\/m\//, 'm/');
    }
    return path;
  } else if (Array.isArray(path)) {
    // Remove leading 0 if it represents duplicate m/ prefix
    if (path.length > 0 && path[0] === 0 && path.length > 1) {
      const second = path[1];
      if (typeof second === 'number' && second >= 0x80000000) {
        return path.slice(1);
      }
    }
    return path;
  }
  return path;
}

/**
 * Convert derivation path to string format
 */
function pathToString(path: DerivationPath): string {
  if (typeof path === 'string') {
    return path;
  } else if (Array.isArray(path)) {
    return path.map(p => {
      if (typeof p === 'number') {
        return p >= 0x80000000 ? `${(p & 0x7fffffff)}'` : `${p}`;
      }
      return String(p);
    }).join('/');
  }
  return '';
}

/**
 * Preprocessing for send_begin PSBTs: Update RGB PSBT metadata to BDK can match inputs.
 */
function preprocessPsbtForBDK(
  psbtBase64: string,
  rootNode: BIP32Interface,
  fp: string,
  network: Network
): string {
  if (!Psbt || !networks) {
    throw new CryptoError('BitcoinJS modules not loaded');
  }
  const psbt = Psbt!.fromBase64(psbtBase64.trim()) as BitcoinJsPsbt;
  const bjsNet: BitcoinJsNetwork = network === 'mainnet' ? networks!.bitcoin : networks!.testnet;
  
  for (let i = 0; i < psbt.inputCount; i++) {
    const input = psbt.data.inputs[i];
    
    if (input.tapBip32Derivation && input.tapBip32Derivation.length > 0) {
      input.tapBip32Derivation.forEach((deriv) => {
        const normalizedPath = normalizePath(deriv.path as DerivationPath);
        deriv.path = pathToString(normalizedPath);
        let pathStr = pathToString(normalizedPath);
        
        if (!pathStr.startsWith('m/')) {
          pathStr = 'm/' + pathStr;
        }
        
        try {
          if (!toXOnly || !payments) {
            return;
          }
          const derivedNode = rootNode.derivePath(pathStr);
          const pubkey = derivedNode.publicKey;
          if (!pubkey) {
            return;
          }
          const pubkeyBuffer = pubkey instanceof Buffer ? pubkey : Buffer.from(pubkey);
          const xOnly = toXOnly!(pubkeyBuffer);
          const p2tr = payments.p2tr({ internalPubkey: xOnly, network: bjsNet });
          const expectedScript = p2tr.output;
          
          if (!expectedScript) {
            return;
          }
          
          // Update witness_utxo.script if it doesn't match
          if (input.witnessUtxo && expectedScript) {
            const currentScript = input.witnessUtxo.script;
            if (!currentScript.equals(expectedScript)) {
              input.witnessUtxo.script = expectedScript;
            }
          }
          
          // Update tapInternalKey to match derivation
          if (xOnly) {
            if (!input.tapInternalKey || !input.tapInternalKey.equals(xOnly)) {
              input.tapInternalKey = xOnly;
            }
          }
          
          // Update master fingerprint
          const fingerprintBuf = Buffer.from(fp, 'hex');
          if (!deriv.masterFingerprint) {
            deriv.masterFingerprint = fingerprintBuf;
          } else {
            const currentFp = Buffer.from(deriv.masterFingerprint);
            if (!currentFp.equals(fingerprintBuf)) {
              deriv.masterFingerprint = fingerprintBuf;
            }
          }
          
          // Update pubkey in derivation
          if (!deriv.pubkey || !deriv.pubkey.equals(xOnly)) {
            deriv.pubkey = xOnly;
          }
        } catch (e) {
          // Skip this derivation if it can't be derived from path
        }
      });
    } 
    
    // Update legacy bip32Derivation if needed
    if (input.bip32Derivation && input.bip32Derivation.length > 0) {
      input.bip32Derivation.forEach((deriv) => {
        const normalizedPath = normalizePath(deriv.path as DerivationPath);
        deriv.path = pathToString(normalizedPath);
      });
    }
  }
  
  return psbt.toBase64();
}

/**
 * Detect PSBT type by examining derivation paths
 * @returns {'create_utxo'|'send'} PSBT type
 */
function detectPsbtType(psbtBase64: string): PsbtType {
  if (!Psbt) {
    throw new CryptoError('BitcoinJS Psbt module not loaded');
  }
  try {
    const psbt = Psbt.fromBase64(psbtBase64.trim()) as BitcoinJsPsbt;
    for (let i = 0; i < psbt.inputCount; i++) {
      const input = psbt.data.inputs[i];
      if (input.tapBip32Derivation && input.tapBip32Derivation.length > 0) {
        for (const deriv of input.tapBip32Derivation) {
          const pathStr = pathToString(deriv.path as DerivationPath);
          // Check if path contains RGB coin type - indicates send_begin PSBT
          if (pathStr.includes("827167'") || pathStr.includes("827166'")) {
            return 'send';
          }
        }
      }
    }
    return 'create_utxo';
  } catch (e) {
    return 'create_utxo'; // Default to simpler structure
  }
}

/**
 * Derive descriptors based on PSBT type
 */
function deriveDescriptors(
  rootNode: BIP32Interface,
  fp: string,
  network: Network,
  psbtType: PsbtType
): Descriptors {
  const isMainnet = network === 'mainnet';
  const coinTypeBtc = isMainnet ? COIN_BITCOIN_MAINNET : COIN_BITCOIN_TESTNET;
  const coinTypeRgb = isMainnet ? COIN_RGB_MAINNET : COIN_RGB_TESTNET;
  
  if (psbtType === 'create_utxo') {
    // For create_utxo_begin: Use account-level xprv structure
    const accountPath = `m/${DERIVATION_PURPOSE}'/${coinTypeBtc}'/${DERIVATION_ACCOUNT}'`;
    const accountNode = rootNode.derivePath(accountPath);
    const accountXprv = accountNode.toBase58();
    const origin = `[${fp}/${DERIVATION_PURPOSE}'/${coinTypeBtc}'/${DERIVATION_ACCOUNT}']`;
    return {
      external: `tr(${origin}${accountXprv}/0/*)`,
      internal: `tr(${origin}${accountXprv}/1/*)`
    };
  } else {
    // For send_begin: Use RGB descriptor structure
    const rgbAccountPath = `m/${DERIVATION_PURPOSE}'/${coinTypeRgb}'/${DERIVATION_ACCOUNT}'`;
    const rgbAccountNode = rootNode.derivePath(rgbAccountPath);
    const rgbKeychainNode = rgbAccountNode.derive(KEYCHAIN_RGB);
    const rgbKeychainXprv = rgbKeychainNode.toBase58();
    const rgbOrigin = `[${fp}/${DERIVATION_PURPOSE}'/${coinTypeRgb}'/${DERIVATION_ACCOUNT}'/${KEYCHAIN_RGB}]`;
    
    const btcAccountPath = `m/${DERIVATION_PURPOSE}'/${coinTypeBtc}'/${DERIVATION_ACCOUNT}'`;
    const btcAccountNode = rootNode.derivePath(btcAccountPath);
    const btcKeychainNode = btcAccountNode.derive(KEYCHAIN_BTC);
    const btcKeychainXprv = btcKeychainNode.toBase58();
    const btcOrigin = `[${fp}/${DERIVATION_PURPOSE}'/${coinTypeBtc}'/${DERIVATION_ACCOUNT}'/${KEYCHAIN_BTC}]`;
    
    return {
      external: `tr(${rgbOrigin}${rgbKeychainXprv}/*)`,
      internal: `tr(${btcOrigin}${btcKeychainXprv}/*)`
    };
  }
}

/**
 * Get network versions for BIP32
 * Alias for shared network versions utility
 */
function getNetworkVersions(network: Network): NetworkVersions {
  return getBIP32NetworkVersions(network);
}

/**
 * Calculate master fingerprint from root node
 * Alias for shared fingerprint calculation utility
 */
async function getMasterFingerprint(rootNode: BIP32Interface): Promise<string> {
  return calculateMasterFingerprint(rootNode);
}

async function signPsbtFromSeedInternal(
  seed: Buffer | Uint8Array,
  psbtBase64: string,
  network: Network,
  options: SignPsbtOptions = {}
): Promise<string> {
  await ensureDependencies();

  validatePsbt(psbtBase64, 'psbtBase64');

  if (!ecc || !BIP32FactoryInstance || !bdk) {
    throw new CryptoError('Dependencies not loaded');
  }

  const bip32 = BIP32FactoryInstance(ecc);
  const seedBuffer = normalizeSeedBuffer(seed);
  const versions = getNetworkVersions(network);

  let rootNode: BIP32Interface;
  try {
    rootNode = bip32.fromSeed(seedBuffer, versions);
  } catch (error) {
    throw new CryptoError('Failed to derive root node from seed', error as Error);
  }

  const fp = await getMasterFingerprint(rootNode);
  const psbtType = detectPsbtType(psbtBase64);
  const needsPreprocessing = psbtType === 'send';
  const { external, internal } = deriveDescriptors(rootNode, fp, network, psbtType);

  let wallet: BDKWallet;
  try {
    wallet = bdk!.Wallet.create(network as BDKNetwork, external, internal);
  } catch (error) {
    throw new CryptoError('Failed to create BDK wallet', error as Error);
  }

  let processedPsbt = psbtBase64.trim();
  if (needsPreprocessing || options.preprocess) {
    try {
      processedPsbt = preprocessPsbtForBDK(psbtBase64, rootNode, fp, network);
    } catch (error) {
      throw new CryptoError('Failed to preprocess PSBT', error as Error);
    }
  }

  let pstb: BDKPsbt;
  try {
    pstb = bdk!.Psbt.from_string(processedPsbt);
  } catch (error) {
    throw new CryptoError('Failed to parse PSBT', error as Error);
  }

  const signOptions = options.signOptions || new bdk.SignOptions();
  try {
    wallet.sign(pstb, signOptions);
  } catch (error) {
    throw new CryptoError('Failed to sign PSBT', error as Error);
  }

  return pstb.toString().trim();
}

/**
 * Sign a PSBT using BDK
 * 
 * Note: This function is async due to dependency loading and crypto operations.
 * 
 * @param mnemonic - BIP39 mnemonic phrase (12 or 24 words)
 * @param psbtBase64 - Base64 encoded PSBT string
 * @param network - Bitcoin network ('mainnet' | 'testnet' | 'signet' | 'regtest')
 * @param options - Optional signing options
 * @param options.signOptions - BDK sign options (defaults used if not provided)
 * @param options.preprocess - Force preprocessing (auto-detected by default)
 * @returns Base64 encoded signed PSBT
 * @throws {ValidationError} If mnemonic or PSBT format is invalid
 * @throws {CryptoError} If signing fails
 * 
 * @example
 * ```typescript
 * const signedPsbt = signPsbt(
 *   'abandon abandon abandon...',
 *   'cHNidP8BAIkBAAAAA...',
 *   'testnet'
 * );
 * ```
 */
export async function signPsbt(
  mnemonic: string,
  psbtBase64: string,
  network: Network = 'testnet',
  options: SignPsbtOptions = {}
): Promise<string> {
  try {
    await ensureDependencies();
    
    // Validate inputs
    validateMnemonic(mnemonic, 'mnemonic');
    if (!bip39 || typeof bip39.mnemonicToSeedSync !== 'function') {
      throw new CryptoError('bip39 module not loaded correctly');
    }

    let seed: Buffer;
    try {
      seed = bip39.mnemonicToSeedSync(mnemonic);
    } catch (error) {
      throw new ValidationError('Invalid mnemonic format', 'mnemonic');
    }

    const normalizedNetwork = normalizeNetwork(network);
    return await signPsbtFromSeedInternal(seed, psbtBase64, normalizedNetwork, options);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof CryptoError) {
      throw error;
    }
    throw new CryptoError('Unexpected error during PSBT signing', error as Error);
  }
}

/**
 * Legacy sync-named wrapper (still async under the hood).
 */
export async function signPsbtSync(
  mnemonic: string,
  psbtBase64: string,
  network: Network = 'testnet',
  options: SignPsbtOptions = {}
): Promise<string> {
  return signPsbt(mnemonic, psbtBase64, network, options);
}

/**
 * Sign a PSBT using a raw BIP39 seed (hex string or Uint8Array)
 */
export async function signPsbtFromSeed(
  seed: string | Uint8Array,
  psbtBase64: string,
  network: Network = 'testnet',
  options: SignPsbtOptions = {}
): Promise<string> {
  const normalizedSeed = normalizeSeedInput(seed);
  const normalizedNetwork = normalizeNetwork(network);
  return signPsbtFromSeedInternal(normalizedSeed, psbtBase64, normalizedNetwork, options);
}

