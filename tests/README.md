# Tests

## Setup

Tests are configured using Jest with TypeScript support.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

- `tests/keys.test.ts` - Tests for key generation and derivation functions
- `tests/signer.test.ts` - Tests for PSBT signing functionality

## Known Issues

### import.meta.url Support

The source code uses `import.meta.url` for CommonJS module compatibility. Jest/ts-jest doesn't fully support transforming this in all contexts. 

**Workaround**: Tests currently need some additional configuration. The recommended approach is:

1. Build the project first: `npm run build`
2. The tests are designed to work with the compiled output

## Test Data

Tests use the following testnet data:

- **Mnemonic**: `poem twice question inch happy capital grain quality laptop dry chaos what`
- **Expected Keys**: 
  - `xpub`: `tpubD6NzVbkrYhZ4XCaTDersU6277zvyyV6uCCeEgx1jfv7bUYMrbTt8Vem1MBt5Gmp7eMwjv4rB54s2kjqNNtTLYpwFsVX7H2H93pJ8SpZFRRi`
  - `account_xpub_vanilla`: `tpubDDMTD6EJKKLP6Gx9JUnMpjf9NYyePJszmqBnNqULNmcgEuU1yQ3JsHhWZdRFecszWETnNsmhEe9vnaNibfzZkDDHycbR2rGFbXdHWRgBfu7`
  - `account_xpub_colored`: `tpubDDPLJfdVbDoGtnn6hSto3oCnm6hpfHe9uk2MxcANanxk87EuquhSVfSLQv7e5UykgzaFn41DUXaikjjVGcUSUTGNaJ9LcozfRwatKp1vTfC`
  - `master_fingerprint`: `a66bffef`

## Test Coverage

The tests cover:

### Keys Module
- ✅ Generate new wallet keys for different networks
- ✅ Derive keys from existing mnemonic
- ✅ Validate mnemonic input
- ✅ Error handling for invalid inputs
- ✅ Deterministic key derivation

### Signer Module
- ✅ Sign UTXO creation PSBTs
- ✅ Sign send PSBTs
- ✅ Validate input parameters
- ✅ Error handling
- ✅ Synchronous operation verification

