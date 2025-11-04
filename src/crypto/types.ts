/**
 * RGB Crypto module types
 * 
 * Type definitions for RGB-specific cryptographic operations including
 * PSBT signing and key derivation for RGB protocol
 */

/**
 * Bitcoin network type
 */
export type Network = 'mainnet' | 'testnet' | 'signet' | 'regtest';

/**
 * PSBT type (create_utxo or send)
 */
export type PsbtType = 'create_utxo' | 'send';

/**
 * Network versions for BIP32
 */
export interface NetworkVersions {
  bip32: {
    public: number;
    private: number;
  };
  wif: number;
}

/**
 * Descriptors for wallet derivation
 */
export interface Descriptors {
  external: string;
  internal: string;
}

