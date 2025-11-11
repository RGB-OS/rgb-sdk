# Browser Testing Guide

This directory contains tests for verifying the SDK works in browser environments.

## Test Files

### 1. `browser-test.html` - Interactive Browser Test

A standalone HTML file that can be opened directly in a browser to test the SDK.

**Usage:**

### Option 1: Using npm script (Recommended)
```bash
# Build and serve the test page
npm run test:browser:serve
```
This will:
1. Build the SDK automatically
2. Start an HTTP server on port 8000
3. Open the test page in your default browser

### Option 2: Using Python's built-in server
```bash
# Build the SDK first
npm run build

# Start Python HTTP server (from project root)
python3 -m http.server 8000

# Then open in browser:
# http://localhost:8000/tests/browser-test.html
```

### Option 3: Using Node.js http-server
```bash
# Build the SDK first
npm run build

# Start http-server (from project root)
npx http-server -p 8000

# Then open in browser:
# http://localhost:8000/tests/browser-test.html
```

### Option 4: Using the custom script
```bash
# Build the SDK first
npm run build

# Run the custom server script
node scripts/serve-test.html

# Then open in browser:
# http://localhost:8000/tests/browser-test.html
```

### Option 5: Using VS Code Live Server extension
1. Install "Live Server" extension in VS Code
2. Right-click on `tests/browser-test.html`
3. Select "Open with Live Server"

**Features:**
- Interactive test interface
- Real-time results display
- Configurable test parameters (mnemonic, network)
- Tests for:
  - Key generation (`generateKeys`)
  - Key derivation (`deriveKeysFromMnemonic`)
  - PSBT signing (UTXO creation)
  - PSBT signing (Send)

**Note:** You **cannot** open the HTML file directly with `file://` protocol due to CORS restrictions with ESM modules. You **must** use an HTTP server.

### 2. `browser.test.ts` - Automated Browser Tests

Jest tests using jsdom to simulate a browser environment.

**Usage:**
```bash
# Run browser tests only
npm run test:browser

# Run all tests (including browser tests)
npm test
```

**What it tests:**
- Environment detection (browser vs Node.js)
- Key generation in browser environment
- Key derivation in browser environment
- PSBT signing in browser environment
- Verification that `@bitcoindevkit/bdk-wallet-web` is used instead of node version

## Browser Environment Detection

The SDK automatically detects the environment using:
- `window` and `document` objects for browser
- `process.versions.node` for Node.js

When running in browser:
- Uses `@bitcoindevkit/bdk-wallet-web` for BDK operations
- Uses Web Crypto API for cryptographic operations
- Uses ESM dynamic imports for all dependencies

## Testing Checklist

- [ ] SDK loads correctly in browser
- [ ] Environment detection works correctly
- [ ] Key generation works in browser
- [ ] Key derivation works in browser
- [ ] PSBT signing works in browser
- [ ] Correct BDK package is loaded (`bdk-wallet-web` not `bdk-wallet-node`)
- [ ] Web Crypto API is used for crypto operations
- [ ] No Node.js-specific APIs are used

## Troubleshooting

### CORS Errors
If you see CORS errors when opening the HTML file directly:
- Use a local web server (see instructions above)
- Or use a browser extension that disables CORS (development only)

### WASM Loading Issues
If WASM modules fail to load:
- Check browser console for errors
- Verify the build output includes WASM files
- Ensure the SDK is built: `npm run build`

### Module Import Errors
If you see module import errors:
- Ensure you're using the ESM build (`dist/index.mjs`)
- Check that all dependencies are properly bundled
- Verify the browser supports ES modules
