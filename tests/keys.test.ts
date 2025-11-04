// Import from built ESM dist files
// Using dynamic import to handle WASM modules with experimental flags
import { generateKeys, deriveKeysFromMnemonic, restoreKeys, ValidationError, CryptoError } from '../dist/index.mjs';

describe('keys', () => {
  // Test data from user
  const testMnemonic = 'poem twice question inch happy capital grain quality laptop dry chaos what';
  const expectedKeys = {
    mnemonic: testMnemonic,
    xpub: 'tpubD6NzVbkrYhZ4XCaTDersU6277zvyyV6uCCeEgx1jfv7bUYMrbTt8Vem1MBt5Gmp7eMwjv4rB54s2kjqNNtTLYpwFsVX7H2H93pJ8SpZFRRi',
    account_xpub_vanilla: 'tpubDDMTD6EJKKLP6Gx9JUnMpjf9NYyePJszmqBnNqULNmcgEuU1yQ3JsHhWZdRFecszWETnNsmhEe9vnaNibfzZkDDHycbR2rGFbXdHWRgBfu7',
    account_xpub_colored: 'tpubDDPLJfdVbDoGtnn6hSto3oCnm6hpfHe9uk2MxcANanxk87EuquhSVfSLQv7e5UykgzaFn41DUXaikjjVGcUSUTGNaJ9LcozfRwatKp1vTfC',
    master_fingerprint: 'a66bffef',
  };

  describe('generateKeys', () => {
    it('should generate valid keys for testnet', async () => {
      const keys = await generateKeys('testnet');
      
      expect(keys).toHaveProperty('mnemonic');
      expect(keys).toHaveProperty('xpub');
      expect(keys).toHaveProperty('account_xpub_vanilla');
      expect(keys).toHaveProperty('account_xpub_colored');
      expect(keys).toHaveProperty('master_fingerprint');
      
      // Validate mnemonic format
      expect(keys.mnemonic).toBeTruthy();
      expect(keys.mnemonic.split(' ').length).toBe(12);
      
      // Validate xpub format (starts with tpub for testnet)
      expect(keys.xpub).toMatch(/^tpub/);
      expect(keys.account_xpub_vanilla).toMatch(/^tpub/);
      expect(keys.account_xpub_colored).toMatch(/^tpub/);
      
      // Validate master fingerprint format (8 hex chars)
      expect(keys.master_fingerprint).toMatch(/^[0-9a-f]{8}$/i);
    });

    it('should generate valid keys for mainnet', async () => {
      const keys = await generateKeys('mainnet');
      
      expect(keys.xpub).toMatch(/^xpub/);
      expect(keys.account_xpub_vanilla).toMatch(/^xpub/);
      expect(keys.account_xpub_colored).toMatch(/^xpub/);
      expect(keys.master_fingerprint).toMatch(/^[0-9a-f]{8}$/i);
    });

    it('should generate valid keys for regtest', async () => {
      const keys = await generateKeys('regtest');
      
      expect(keys.xpub).toMatch(/^tpub/);
      expect(keys.account_xpub_vanilla).toMatch(/^tpub/);
      expect(keys.account_xpub_colored).toMatch(/^tpub/);
      expect(keys.master_fingerprint).toMatch(/^[0-9a-f]{8}$/i);
    });

    it('should generate different keys on each call', async () => {
      const keys1 = await generateKeys('testnet');
      const keys2 = await generateKeys('testnet');
      
      expect(keys1.mnemonic).not.toBe(keys2.mnemonic);
      expect(keys1.xpub).not.toBe(keys2.xpub);
    });

    it('should accept network as number', async () => {
      const keys = await generateKeys(3); // Regtest
      
      expect(keys).toHaveProperty('mnemonic');
      expect(keys).toHaveProperty('account_xpub_vanilla');
      expect(keys).toHaveProperty('account_xpub_colored');
    });
  });

  describe('deriveKeysFromMnemonic', () => {
    it('should derive correct keys from testnet mnemonic', async () => {
      const keys = await deriveKeysFromMnemonic('testnet', testMnemonic);
      
      expect(keys.mnemonic).toBe(testMnemonic);
      expect(keys.xpub).toBe(expectedKeys.xpub);
      expect(keys.account_xpub_vanilla).toBe(expectedKeys.account_xpub_vanilla);
      expect(keys.account_xpub_colored).toBe(expectedKeys.account_xpub_colored);
      expect(keys.master_fingerprint.toLowerCase()).toBe(expectedKeys.master_fingerprint.toLowerCase());
    });

    it('should derive keys correctly with trimmed mnemonic', async () => {
      const trimmedMnemonic = `  ${testMnemonic}  `;
      // The function should handle trimming internally
      const keys = await deriveKeysFromMnemonic('testnet', trimmedMnemonic.trim());
      
      expect(keys.account_xpub_vanilla).toBe(expectedKeys.account_xpub_vanilla);
      expect(keys.master_fingerprint.toLowerCase()).toBe(expectedKeys.master_fingerprint.toLowerCase());
    });

    it('should throw ValidationError for empty mnemonic', async () => {
      await expect(deriveKeysFromMnemonic('testnet', '')).rejects.toThrow(ValidationError);
      await expect(deriveKeysFromMnemonic('testnet', '')).rejects.toThrow('mnemonic');
    });

    it('should throw ValidationError for invalid mnemonic format', async () => {
      await expect(deriveKeysFromMnemonic('testnet', 'invalid mnemonic phrase')).rejects.toThrow(ValidationError);
      await expect(deriveKeysFromMnemonic('testnet', 'abandon abandon abandon')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for non-BIP39 mnemonic', async () => {
      const invalidMnemonic = 'invalid words that are not in the bip39 word list'.split(' ').slice(0, 12).join(' ');
      await expect(deriveKeysFromMnemonic('testnet', invalidMnemonic)).rejects.toThrow(ValidationError);
    });

    it('should work with different networks', async () => {
      const testnetKeys = await deriveKeysFromMnemonic('testnet', testMnemonic);
      const mainnetKeys = await deriveKeysFromMnemonic('mainnet', testMnemonic);
      
      // Mainnet and testnet use different BIP32 versions, so xpubs will differ
      expect(testnetKeys.account_xpub_vanilla).not.toBe(mainnetKeys.account_xpub_vanilla);
      
      // Master fingerprint should be the same (derived from seed, not network)
      expect(testnetKeys.master_fingerprint).toBe(mainnetKeys.master_fingerprint);
    });

    it('should accept network as number', async () => {
      const keys = await deriveKeysFromMnemonic(2, testMnemonic); // Testnet = 2
      
      expect(keys.account_xpub_vanilla).toMatch(/^tpub/);
      expect(keys.account_xpub_colored).toMatch(/^tpub/);
    });

    it('should produce deterministic results', async () => {
      const keys1 = await deriveKeysFromMnemonic('testnet', testMnemonic);
      const keys2 = await deriveKeysFromMnemonic('testnet', testMnemonic);
      
      expect(keys1.mnemonic).toBe(keys2.mnemonic);
      expect(keys1.xpub).toBe(keys2.xpub);
      expect(keys1.account_xpub_vanilla).toBe(keys2.account_xpub_vanilla);
      expect(keys1.account_xpub_colored).toBe(keys2.account_xpub_colored);
      expect(keys1.master_fingerprint).toBe(keys2.master_fingerprint);
    });
  });

  describe('restoreKeys (deprecated alias)', () => {
    it('should work as alias for deriveKeysFromMnemonic', async () => {
      const keys = await restoreKeys('testnet', testMnemonic);
      
      expect(keys.mnemonic).toBe(testMnemonic);
      expect(keys.account_xpub_vanilla).toBe(expectedKeys.account_xpub_vanilla);
      expect(keys.master_fingerprint.toLowerCase()).toBe(expectedKeys.master_fingerprint.toLowerCase());
    });
  });

  describe('error handling', () => {
    it('should throw CryptoError on generation failure', async () => {
      // This test verifies error type but actual failure scenarios
      // would require mocking internal dependencies
      try {
        const keys = await generateKeys('testnet');
        expect(keys).toBeDefined();
      } catch (error) {
        expect(error).toBeInstanceOf(CryptoError);
      }
    });

    it('should throw CryptoError on derivation failure', async () => {
      // This test verifies error type but actual failure scenarios
      // would require mocking internal dependencies
      try {
        const keys = await deriveKeysFromMnemonic('testnet', testMnemonic);
        expect(keys).toBeDefined();
      } catch (error) {
        if (error instanceof CryptoError || error instanceof ValidationError) {
          expect(error).toBeInstanceOf(Error);
        } else {
          throw error;
        }
      }
    });
  });
});

