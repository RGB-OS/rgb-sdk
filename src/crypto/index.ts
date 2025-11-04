/**
 * Crypto module exports
 * 
 * This module contains RGB-specific cryptographic operations including:
 * - PSBT signing for RGB transfers (create_utxo_begin and send_begin PSBTs)
 * - RGB key generation and derivation (vanilla and colored keychains)
 * - Network-related cryptographic operations for RGB protocol
 * - BIP86 Taproot key derivation for RGB wallets
 */

// Export signer functions
export { signPsbt, signPsbtSync } from './signer';
export type { SignPsbtOptions } from './signer';

// Export key functions
export { generateKeys, deriveKeysFromMnemonic, restoreKeys, accountXpubsFromMnemonic } from './keys';
export type { GeneratedKeys, AccountXpubs } from './keys';

// Export types
export type { Network, PsbtType, NetworkVersions, Descriptors } from './types';

