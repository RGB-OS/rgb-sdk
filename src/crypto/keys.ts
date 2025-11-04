// Copyright 2024 Tether Operations Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * RGB Key Generation and Derivation
 * 
 * This module provides RGB-specific cryptographic key operations including:
 * - RGB wallet key generation (vanilla and colored keychains)
 * - BIP86 Taproot key derivation for RGB protocol
 * - Account-level key derivation with RGB coin types
 * - Master fingerprint calculation for RGB wallets
 */

import { isNode } from '../utils/environment';
import { ripemd160Sync, sha256Sync } from '../utils/crypto-browser';
import type { BIP32Interface } from 'bip32';
import type { Network } from './types';
import { ValidationError, CryptoError } from '../errors';
import { validateMnemonic, normalizeNetwork } from '../utils/validation';
import {
  DERIVATION_PURPOSE,
  DERIVATION_ACCOUNT,
  COIN_RGB_MAINNET,
  COIN_RGB_TESTNET,
} from '../constants';

// Dynamic imports for browser compatibility
let bip39: any;
let ecc: any;
let BIP32Factory: any;

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
  } else {
    // Browser: use ESM imports
    const bip39Module = await import('bip39');
    bip39 = bip39Module.default || bip39Module;
    const eccModule = await import('tiny-secp256k1');
    ecc = eccModule;
    const bip32 = await import('bip32');
    BIP32Factory = bip32.BIP32Factory;
  }
}

// Initialize dependencies - always load on first use
let dependenciesLoaded = false;
let dependenciesLoading: Promise<void> | null = null;

async function ensureDependencies() {
  // If already loaded, return immediately
  if (dependenciesLoaded) {
    return;
  }
  
  // If already loading, wait for it
  if (dependenciesLoading) {
    await dependenciesLoading;
    return;
  }
  
  // Start loading
  dependenciesLoading = loadDependencies().then(() => {
    dependenciesLoaded = true;
    dependenciesLoading = null;
  }).catch((error) => {
    dependenciesLoading = null;
    throw error;
  });
  
  await dependenciesLoading;
}

// Bip32 network versions (matches BIP32 Network schema: { bip32: { public, private }, wif })
interface NetworkVersions {
  bip32: {
    public: number;
    private: number;
  };
  wif: number;
}

const NETWORKS: Record<Network, NetworkVersions> = {
  mainnet: {
    bip32: { public: 0x0488b21e, private: 0x0488ade4 }, // xpub/xprv
    wif: 0x80
  },
  testnet: {
    bip32: { public: 0x043587cf, private: 0x04358394 }, // tpub/tprv
    wif: 0xef
  },
  signet: {
    bip32: { public: 0x043587cf, private: 0x04358394 },
    wif: 0xef
  },
  regtest: {
    bip32: { public: 0x043587cf, private: 0x04358394 },
    wif: 0xef
  }
};

// Use constants directly from constants module (no local aliases)

export interface GeneratedKeys {
  mnemonic: string;
  xpub: string;
  account_xpub_vanilla: string;
  account_xpub_colored: string;
  master_fingerprint: string;
}

export interface AccountXpubs {
  account_xpub_vanilla: string;
  account_xpub_colored: string;
}

/**
 * Convert network string or number to Network type
 */
function toNetworkName(bitcoinNetwork: string | number): Network {
  const n = String(bitcoinNetwork).toLowerCase();
  if (n.includes('main')) return 'mainnet';
  if (n.includes('reg')) return 'regtest';
  if (n.includes('sig')) return 'signet';
  return 'testnet';
}

/**
 * Get coin type for derivation path
 */
function getCoinType(bitcoinNetwork: string | number, rgb: boolean): number {
  const net = toNetworkName(bitcoinNetwork);
  if (rgb) return net === 'mainnet' ? COIN_RGB_MAINNET : COIN_RGB_TESTNET;
  return net === 'mainnet' ? 0 : 1;
}

/**
 * Get network versions for BIP32
 * Returns full Network object expected by BIP32: { bip32: { public, private }, wif }
 */
function getNetworkVersions(bitcoinNetwork: string | number): NetworkVersions {
  const net = toNetworkName(bitcoinNetwork);
  const versions = NETWORKS[net];
  if (!versions) throw new Error(`Unsupported network: ${bitcoinNetwork}`);
  return versions;
}

/**
 * Generate account derivation path: m / 86' / coinType' / 0'
 */
function accountDerivationPath(bitcoinNetwork: string | number, rgb: boolean): string {
  const coinType = getCoinType(bitcoinNetwork, rgb);
  return `m/${DERIVATION_PURPOSE}'/${coinType}'/${DERIVATION_ACCOUNT}'`;
}

/**
 * Calculate master fingerprint from BIP32 node
 * fingerprint = first 4 bytes of HASH160(pubkey)
 */
async function masterFingerprintFromNode(node: BIP32Interface): Promise<string> {
  const pubkey = node.publicKey;
  const sha = await sha256Sync(pubkey);
  // Workaround for TypeScript DTS build type resolution issue
  const ripemd160Fn = ripemd160Sync as (data: Uint8Array | Buffer) => Promise<Uint8Array>;
  const ripe = await ripemd160Fn(sha as Uint8Array);
  // @ts-ignore
  return ripe.subarray(0, 4).toString('hex');
}

/**
 * Convert mnemonic to root BIP32 node
 */
async function mnemonicToRoot(mnemonic: string, bitcoinNetwork: string | number): Promise<BIP32Interface> {
  await ensureDependencies();
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const versions = getNetworkVersions(bitcoinNetwork);
  const bip32 = BIP32Factory(ecc);
  return bip32.fromSeed(seed, versions);
}

/**
 * Get account extended public key from mnemonic
 */
async function getAccountXpub(mnemonic: string, bitcoinNetwork: string | number, rgb: boolean): Promise<string> {
  const root = await mnemonicToRoot(mnemonic, bitcoinNetwork);
  const path = accountDerivationPath(bitcoinNetwork, rgb);
  const acct = root.derivePath(path);
  return acct.neutered().toBase58();
}

/**
 * Get master extended public key from mnemonic
 */
async function getMasterXpub(mnemonic: string, bitcoinNetwork: string | number): Promise<string> {
  const root = await mnemonicToRoot(mnemonic, bitcoinNetwork);
  return root.neutered().toBase58();
}

/**
 * Build complete keys output object
 */
async function buildKeysOutput(mnemonic: string, bitcoinNetwork: string | number): Promise<GeneratedKeys> {
  const root = await mnemonicToRoot(mnemonic, bitcoinNetwork);
  const xpub = root.neutered().toBase58();
  const master_fingerprint = await masterFingerprintFromNode(root);

  const account_xpub_vanilla = await getAccountXpub(mnemonic, bitcoinNetwork, false);
  const account_xpub_colored = await getAccountXpub(mnemonic, bitcoinNetwork, true);

  return {
    mnemonic,
    xpub,
    account_xpub_vanilla,
    account_xpub_colored,
    master_fingerprint
  };
}

/**
 * Generate new wallet keys with a random mnemonic
 * Mirrors rgb_lib::generate_keys (creates new 12-word mnemonic)
 * 
 * @param bitcoinNetwork - Network string or number (default: 'regtest')
 * @returns Promise resolving to generated keys including mnemonic, xpubs, and master fingerprint
 * @throws {CryptoError} If key generation fails
 * 
 * @example
 * ```typescript
 * const keys = await generateKeys('testnet');
 * console.log('Mnemonic:', keys.mnemonic);
 * console.log('Master Fingerprint:', keys.master_fingerprint);
 * ```
 */
export async function generateKeys(bitcoinNetwork: string | number = 'regtest'): Promise<GeneratedKeys> {
  try {
    await ensureDependencies();
    if (!bip39 || typeof bip39.generateMnemonic !== 'function') {
      throw new Error('bip39 not loaded. Dependencies may not have initialized correctly.');
    }
    const mnemonic = bip39.generateMnemonic(128);
    return await buildKeysOutput(mnemonic, bitcoinNetwork);
  } catch (error) {
    if (error instanceof Error && error.message.includes('bip39 not loaded')) {
      throw new CryptoError('Failed to load dependencies', error);
    }
    // Log the actual error for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    throw new CryptoError(`Failed to generate mnemonic: ${errorMessage}`, error as Error);
  }
}

/**
 * Derive wallet keys from existing mnemonic
 * Takes a mnemonic phrase and derives all keys (xpubs, master fingerprint)
 * 
 * This function is the counterpart to `generateKeys()` - instead of generating
 * a new mnemonic, it derives keys from an existing one.
 * 
 * @param bitcoinNetwork - Network string or number (default: 'regtest')
 * @param mnemonic - BIP39 mnemonic phrase
 * @returns Promise resolving to derived keys including mnemonic, xpubs, and master fingerprint
 * @throws {ValidationError} If mnemonic is invalid
 * @throws {CryptoError} If key derivation fails
 * 
 * @example
 * ```typescript
 * const keys = await deriveKeysFromMnemonic('testnet', 'abandon abandon abandon...');
 * console.log('Account XPub:', keys.account_xpub_vanilla);
 * ```
 */
export async function deriveKeysFromMnemonic(
  bitcoinNetwork: string | number = 'regtest',
  mnemonic: string
): Promise<GeneratedKeys> {
  validateMnemonic(mnemonic, 'mnemonic');
  
  try {
    await ensureDependencies();
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new ValidationError('Invalid mnemonic format - failed BIP39 validation', 'mnemonic');
    }
    return await buildKeysOutput(mnemonic.trim(), bitcoinNetwork);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new CryptoError('Failed to derive keys from mnemonic', error as Error);
  }
}

/**
 * Restore wallet keys from existing mnemonic (backward compatibility alias)
 * @deprecated Use `deriveKeysFromMnemonic()` instead. This alias will be removed in a future version.
 * @see deriveKeysFromMnemonic
 */
export async function restoreKeys(
  bitcoinNetwork: string | number = 'regtest',
  mnemonic: string
): Promise<GeneratedKeys> {
  return deriveKeysFromMnemonic(bitcoinNetwork, mnemonic);
}

/**
 * Get account xpubs from mnemonic (convenience function)
 * 
 * @param bitcoinNetwork - Network string or number (default: 'regtest')
 * @param mnemonic - BIP39 mnemonic phrase
 * @returns Promise resolving to account xpubs for vanilla and colored keychains
 * @throws {ValidationError} If mnemonic is invalid
 * @throws {CryptoError} If key derivation fails
 * 
 * @example
 * ```typescript
 * const xpubs = await accountXpubsFromMnemonic('testnet', 'abandon abandon abandon...');
 * console.log('Vanilla XPub:', xpubs.account_xpub_vanilla);
 * console.log('Colored XPub:', xpubs.account_xpub_colored);
 * ```
 */
export async function accountXpubsFromMnemonic(
  bitcoinNetwork: string | number = 'regtest',
  mnemonic: string
): Promise<AccountXpubs> {
  validateMnemonic(mnemonic, 'mnemonic');
  
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new ValidationError('Invalid mnemonic format - failed BIP39 validation', 'mnemonic');
  }
  
  try {
    await ensureDependencies();
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new ValidationError('Invalid mnemonic format - failed BIP39 validation', 'mnemonic');
    }
    return {
      account_xpub_vanilla: await getAccountXpub(mnemonic, bitcoinNetwork, false),
      account_xpub_colored: await getAccountXpub(mnemonic, bitcoinNetwork, true)
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new CryptoError('Failed to derive account xpubs from mnemonic', error as Error);
  }
}
