// Main wallet exports
export { wallet, createWallet, WalletManager, createWalletManager } from './wallet';
export type { WalletInitParams } from './wallet';

// Client exports
export { RGBClient, createClient } from './client/index';
export { RGBClient as ThunderLink } from './client/index'; // Backward compatibility

// Type exports
export * from './types/rgb-model';
export type { Network, PsbtType, SignPsbtOptions, NetworkVersions, Descriptors } from './crypto';
export type { GeneratedKeys, AccountXpubs } from './crypto';

// Function exports
export { signPsbt, signPsbtSync } from './crypto';
export { generateKeys, deriveKeysFromMnemonic, restoreKeys, accountXpubsFromMnemonic } from './crypto';

// Error exports
export {
  SDKError,
  NetworkError,
  ValidationError,
  WalletError,
  CryptoError,
  ConfigurationError,
} from './errors';

// Utility exports
export { logger, configureLogging, LogLevel } from './utils/logger';
export {
  validateNetwork,
  normalizeNetwork,
  validateMnemonic,
  validatePsbt,
  validateBase64,
  validateHex,
  validateRequired,
  validateString,
} from './utils/validation';
export { normalizeNetwork as normalizeNetworkUtil } from './utils/network';

// Constants exports
export * from './constants';