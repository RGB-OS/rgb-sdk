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

import * as bdk from '@metamask/bitcoindevkit';
import { isNode } from '../utils/environment';
import { ripemd160Sync, sha256Sync } from '../utils/crypto-browser';
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
import type { Network, PsbtType, NetworkVersions, Descriptors } from './types';

// Dynamic imports for browser compatibility
let bip39: any;
let ecc: any;
let BIP32Factory: any;
let Psbt: any;
let payments: any;
let networks: any;
let toXOnly: any;

// Load dependencies based on environment
async function loadDependencies() {
  if (isNode()) {
    // Node.js: use createRequire for CommonJS modules
    const { createRequire } = await import('node:module');
    // @ts-ignore - import.meta.url may not be available in CJS build context
    const requireFromModule = createRequire(import.meta.url);
    bip39 = requireFromModule('bip39');
    ecc = requireFromModule('tiny-secp256k1');
    const bip32 = requireFromModule('bip32');
    BIP32Factory = bip32.BIP32Factory;
    const bitcoinjs = requireFromModule('bitcoinjs-lib');
    Psbt = bitcoinjs.Psbt;
    payments = bitcoinjs.payments;
    networks = bitcoinjs.networks;
    toXOnly = requireFromModule('bitcoinjs-lib/src/payments/bip341').toXOnly;
  } else {
    // Browser: use ESM imports
    const bip39Module = await import('bip39');
    bip39 = bip39Module.default || bip39Module;
    const eccModule = await import('tiny-secp256k1');
    ecc = eccModule;
    const bip32 = await import('bip32');
    BIP32Factory = bip32.BIP32Factory;
    const bitcoinjs = await import('bitcoinjs-lib');
    Psbt = bitcoinjs.Psbt;
    payments = bitcoinjs.payments;
    networks = bitcoinjs.networks;
    const bip341 = await import('bitcoinjs-lib/src/payments/bip341');
    toXOnly = (bip341 as any).toXOnly;
  }
}

// Initialize dependencies immediately in Node.js, lazily in browser
let dependenciesLoaded = false;
if (isNode()) {
  loadDependencies().then(() => {
    dependenciesLoaded = true;
  }).catch(() => {
    // Will be loaded on first use
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
  signOptions?: bdk.SignOptions;
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
 * Preprocessing for send_begin PSBTs: Fixes RGB PSBT metadata so BDK can match inputs.
 */
function preprocessPsbtForBDK(
  psbtBase64: string,
  rootNode: BIP32Interface,
  fp: string,
  network: Network
): string {
  const psbt = Psbt.fromBase64(psbtBase64.trim()) as BitcoinJsPsbt;
  const bjsNet: BitcoinJsNetwork = network === 'mainnet' ? networks.bitcoin : networks.testnet;
  
  for (let i = 0; i < psbt.inputCount; i++) {
    const input = psbt.data.inputs[i];
    
    if (input.tapBip32Derivation && input.tapBip32Derivation.length > 0) {
      input.tapBip32Derivation.forEach((deriv) => {
        // Normalize path and ensure it's a string
        const normalizedPath = normalizePath(deriv.path as DerivationPath);
        deriv.path = pathToString(normalizedPath);
        let pathStr = pathToString(normalizedPath);
        
        if (!pathStr.startsWith('m/')) {
          pathStr = 'm/' + pathStr;
        }
        
        // Derive expected script from path
        try {
          const derivedNode = rootNode.derivePath(pathStr);
          const xOnly = toXOnly(derivedNode.publicKey);
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
          
          // Fix master fingerprint
          const fingerprintBuf = Buffer.from(fp, 'hex');
          if (!deriv.masterFingerprint) {
            deriv.masterFingerprint = fingerprintBuf;
          } else {
            const currentFp = Buffer.from(deriv.masterFingerprint);
            if (!currentFp.equals(fingerprintBuf)) {
              deriv.masterFingerprint = fingerprintBuf;
            }
          }
          
          // Fix pubkey in derivation
          if (!deriv.pubkey || !deriv.pubkey.equals(xOnly)) {
            deriv.pubkey = xOnly;
          }
        } catch (e) {
          // Skip this derivation if we can't derive from path
        }
      });
    }
    
    // Fix legacy bip32Derivation if needed
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
 */
function getNetworkVersions(network: Network): NetworkVersions {
  const isMainnet = network === 'mainnet';
  return {
    bip32: isMainnet 
      ? { public: 0x0488b21e, private: 0x0488ade4 }
      : { public: 0x043587cf, private: 0x04358394 },
    wif: isMainnet ? 0x80 : 0xef
  };
}

/**
 * Calculate master fingerprint from root node
 */
async function getMasterFingerprint(rootNode: BIP32Interface): Promise<string> {
  const masterPub = rootNode.publicKey;
  const sha = await sha256Sync(masterPub);
  // Workaround for TypeScript DTS build type resolution issue
  const ripemd160Fn = ripemd160Sync as (data: Uint8Array | Buffer) => Promise<Uint8Array>;
  const ripe = await ripemd160Fn(sha);
  return ripe.slice(0, 4).toString('hex');
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
    // Ensure dependencies are loaded
    await ensureDependencies();
    
    // Validate inputs
    validateMnemonic(mnemonic, 'mnemonic');
    validatePsbt(psbtBase64, 'psbtBase64');
    const normalizedNetwork = normalizeNetwork(network);
    
    // Derive root node and master fingerprint
    const bip32 = BIP32Factory(ecc);
    let seed: Buffer;
    try {
      seed = bip39.mnemonicToSeedSync(mnemonic);
    } catch (error) {
      throw new ValidationError('Invalid mnemonic format', 'mnemonic');
    }
    
    const versions = getNetworkVersions(normalizedNetwork);
    let rootNode: BIP32Interface;
    try {
      // BIP32 expects full Network object: { bip32: { public, private }, wif }
      rootNode = bip32.fromSeed(seed, versions);
    } catch (error) {
      throw new CryptoError('Failed to derive root node from seed', error as Error);
    }
    
    const fp = await getMasterFingerprint(rootNode);
    
    // Detect PSBT type
    const psbtType = detectPsbtType(psbtBase64);
    const needsPreprocessing = psbtType === 'send';
    
    // Derive descriptors
    const { external, internal } = deriveDescriptors(rootNode, fp, normalizedNetwork, psbtType);
    
    // Create BDK wallet
    let wallet: bdk.Wallet;
    try {
      // Cast network to BDK's Network type (they use the same string literal values)
      wallet = bdk.Wallet.create(normalizedNetwork as bdk.Network, external, internal);
    } catch (error) {
      throw new CryptoError('Failed to create BDK wallet', error as Error);
    }
    
    // Preprocess PSBT if needed
    let processedPsbt = psbtBase64.trim();
    if (needsPreprocessing || options.preprocess) {
      try {
        processedPsbt = preprocessPsbtForBDK(psbtBase64, rootNode, fp, normalizedNetwork);
      } catch (error) {
        throw new CryptoError('Failed to preprocess PSBT', error as Error);
      }
    }
    
    // Load PSBT into BDK
    let pstb: bdk.Psbt;
    try {
      pstb = bdk.Psbt.from_string(processedPsbt);
    } catch (error) {
      throw new CryptoError('Failed to parse PSBT', error as Error);
    }
    
    // Sign PSBT
    const signOptions = options.signOptions || new bdk.SignOptions();
    try {
      wallet.sign(pstb, signOptions);
    } catch (error) {
      throw new CryptoError('Failed to sign PSBT', error as Error);
    }
    
    // Return signed PSBT
    const signedPsbt = pstb.toString().trim();
    
    return signedPsbt;
  } catch (error) {
    // Re-throw SDK errors as-is
    if (error instanceof ValidationError || error instanceof CryptoError) {
      throw error;
    }
    // Wrap unexpected errors
    throw new CryptoError('Unexpected error during PSBT signing', error as Error);
  }
}

/**
 * Synchronous version of signPsbt (alias for signPsbt)
 * Kept for backward compatibility - signPsbt is already synchronous
 * 
 * @deprecated Use signPsbt() directly - it's already synchronous
 */
export async function signPsbtSync(
  mnemonic: string,
  psbtBase64: string,
  network: Network = 'testnet',
  options: SignPsbtOptions = {}
): Promise<string> {
  return signPsbt(mnemonic, psbtBase64, network, options);
}

