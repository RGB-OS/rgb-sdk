
# SDK Overview

This is the underlying SDK used by RGB client applications. It provides a complete set of TypeScript/Node.js bindings for interacting with the **RGB Node** and managing RGB-based transfers.

---

## 🧰 What You Can Do with This Library

With this SDK, developers can:

- Generate RGB invoices
- Create and manage UTXOs
- Sign PSBTs using local private keys or hardware signing flows
- Fetch asset balances, transfer status, and other RGB-related state

---


## ⚙️ Capabilities of `rgb-sdk` (via `WalletManager`)

| Method | Description |
|--------|-------------|
| `generateKeys(network)` | Generate new wallet keypair with mnemonic/xpub/master fingerprint |
| `deriveKeysFromMnemonic(network, mnemonic)` | Derive wallet keys from existing mnemonic |
| `registerWallet()` | Register wallet with the RGB Node |
| `getBtcBalance()` | Get on-chain BTC balance |
| `getAddress()` | Get a derived deposit address |
| `listUnspents()` | List unspent UTXOs |
| `listAssets()` | List RGB assets held |
| `getAssetBalance(asset_id)` | Get balance for a specific asset |
| `createUtxosBegin({ up_to, num, size, fee_rate })` | Start creating new UTXOs |
| `createUtxosEnd({ signed_psbt })` | Finalize UTXO creation with a signed PSBT |
| `blindReceive({ asset_id, amount })` | Generate blinded UTXO for receiving |
| `witnessReceive({ asset_id, amount })` | Generate witness UTXO for receiving |
| `issueAssetNia({...})` | Issue a new Non-Inflationary Asset |
| `signPsbt(psbt, mnemonic?)` | Sign PSBT using mnemonic and BDK (async) |
| `refreshWallet()` | Sync and refresh wallet state |
| `listTransactions()` | List BTC-level transactions |
| `listTransfers(asset_id)` | List RGB transfer history for asset |
| `failTransfers(...)` | Mark expired transfers as failed |
| `sendBegin(...)` | Prepare a transfer (build unsigned PSBT) |
| `sendEnd(...)` | Submit signed PSBT to complete transfer |
| `send(...)` | Complete send operation: begin → sign → end |

---

## 🧩 Notes for Custom Integration

- All communication with the RGB Node is handled via HTTP API calls encapsulated in the `RGBClient` class.
- The `signPsbt` method demonstrates how to integrate a signing flow using `bdk-wasm`. This can be replaced with your own HSM or hardware wallet integration if needed.
- By using this SDK, developers have full control over:
  - Transfer orchestration
  - UTXO selection
  - Invoice lifecycle
  - Signing policy

This pattern enables advanced use cases, such as:

- Integrating with third-party identity/auth layers
- Applying custom fee logic or batching
- Implementing compliance and audit tracking

---

## Getting Started

### Installation

```bash
npm install rgb-sdk
```

### Browser Compatibility

This SDK is browser-compatible but requires polyfills for Node.js built-in modules. The SDK uses WebAssembly modules and dynamically loads dependencies based on the environment.

#### Required Polyfills

For React/Next.js applications, you'll need to configure webpack to polyfill Node.js modules. Install the required polyfills:

```bash
npm install --save-dev crypto-browserify stream-browserify buffer process path-browserify
```

#### CRACO Configuration (React with Create React App)

If you're using Create React App with CRACO, create a `craco.config.js` file:

```javascript
const path = require('path');
const webpack = require('webpack');

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
    configure: (webpackConfig) => {
      webpackConfig.resolve = webpackConfig.resolve || {};
      webpackConfig.resolve.fallback = {
        ...(webpackConfig.resolve.fallback || {}),
        crypto: require.resolve('crypto-browserify'),
        'node:crypto': require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
        path: require.resolve('path-browserify'),
        'node:path': require.resolve('path-browserify'),
        fs: false,
        module: false,
      };

      // WASM rule for .wasm files
      const wasmRule = { test: /\.wasm$/, type: 'webassembly/sync' };
      const oneOf = webpackConfig.module?.rules?.find(r => Array.isArray(r.oneOf))?.oneOf;
      if (oneOf) {
        const assetIdx = oneOf.findIndex(r => r.type === 'asset/resource');
        if (assetIdx >= 0) oneOf.splice(assetIdx, 0, wasmRule);
        else oneOf.unshift(wasmRule);
      } else {
        webpackConfig.module = webpackConfig.module || {};
        webpackConfig.module.rules = [wasmRule, ...(webpackConfig.module.rules || [])];
      }

      webpackConfig.experiments = {
        ...webpackConfig.experiments,
        asyncWebAssembly: true,
        topLevelAwait: true,
        syncWebAssembly: true,
        layers: true,
      };

      webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: ['process'],
        }),
      ]);

      return webpackConfig;
    },
  },
};
```

#### Dynamic Import in Browser

Use dynamic import to ensure WASM modules load correctly in browser environments:

```javascript
// Dynamic import ensures the WASM/glue load together
const sdk = await import('rgb-sdk');

const { WalletManager, createWallet } = sdk;

// Use the SDK normally
const keys = await createWallet('testnet');
const wallet = new WalletManager({
  xpub_van: keys.account_xpub_vanilla,
  xpub_col: keys.account_xpub_colored,
  master_fingerprint: keys.master_fingerprint,
  mnemonic: keys.mnemonic,
  network: 'testnet',
  rgb_node_endpoint: 'http://127.0.0.1:8000'
});
```

### Important: WASM Module Support

This SDK uses WebAssembly modules for cryptographic operations. When running scripts, you may need to use the `--experimental-wasm-modules` flag:

```bash
node --experimental-wasm-modules your-script.js
```

**Note**: All npm scripts in this project already include this flag automatically. For browser environments, see the Browser Compatibility section above.

### Basic Usage

```javascript
const { WalletManager, createWallet } = require('rgb-sdk');

// 1. Generate wallet keys
const keys = await createWallet('regtest');
console.log('Master Fingerprint:', keys.master_fingerprint);

// 2. Initialize wallet (constructor-based)
const wallet = new WalletManager({
    xpub_van: keys.account_xpub_vanilla,
    xpub_col: keys.account_xpub_colored,
    master_fingerprint: keys.master_fingerprint,
    mnemonic: keys.mnemonic,
    network: 'regtest',
    rgb_node_endpoint: 'http://127.0.0.1:8000' // RGB Node endpoint
});

// 3. Get wallet address
const address = await wallet.getAddress();
console.log('Wallet address:', address);

// 4. Check balance
const balance = await wallet.getBtcBalance();
console.log('BTC Balance:', balance);
```

---

## Core Workflows

### Wallet Initialization

```javascript
const { WalletManager, createWallet } = require('rgb-sdk');

// Generate new wallet keys
const keys = await createWallet('regtest');

// Initialize wallet with keys (constructor-based - recommended)
const wallet = new WalletManager({
    xpub_van: keys.account_xpub_vanilla,
    xpub_col: keys.account_xpub_colored,
    master_fingerprint: keys.master_fingerprint,
    mnemonic: keys.mnemonic,
    network: 'regtest', // 'mainnet', 'testnet', 'signet', or 'regtest'
    rgb_node_endpoint: 'http://127.0.0.1:8000' // RGB Node endpoint
});

// Register wallet with RGB Node
await wallet.registerWallet();

// Alternative: Derive keys from existing mnemonic
const { deriveKeysFromMnemonic } = require('rgb-sdk');
const restoredKeys = await deriveKeysFromMnemonic('testnet', 'abandon abandon abandon...');
const restoredWallet = new WalletManager({
    xpub_van: restoredKeys.account_xpub_vanilla,
    xpub_col: restoredKeys.account_xpub_colored,
    master_fingerprint: restoredKeys.master_fingerprint,
    mnemonic: restoredKeys.mnemonic,
    network: 'testnet',
    rgb_node_endpoint: 'http://127.0.0.1:8000'
});
```

### UTXO Management

```javascript
// Step 1: Begin UTXO creation
const psbt = await wallet.createUtxosBegin({
    up_to: true,
    num: 5,
    size: 1000,
    fee_rate: 1
});

// Step 2: Sign the PSBT (synchronous operation)
const signed_psbt = wallet.signPsbt(psbt);

// Step 3: Finalize UTXO creation
const utxosCreated = await wallet.createUtxosEnd({ signed_psbt });
console.log(`Created ${utxosCreated} UTXOs`);
```

### Asset Issuance

```javascript
// Issue a new NIA
const asset = await wallet.issueAssetNia({
    ticker: "USDT",
    name: "Tether USD",
    amounts: [1000, 500],
    precision: 6
});

console.log('Asset issued:', asset.asset?.assetId);
```

### Asset Transfers

```javascript
// Create blind receive for receiving wallet
const receiveData = await receiverWallet.blindReceive({
    asset_id: asset_id,
    amount: 100
});

// Step 1: Begin asset transfer
const sendPsbt = await senderWallet.sendBegin({
    invoice: receiveData.invoice,
    fee_rate: 1,
    min_confirmations: 1
});

// Step 2: Sign the PSBT (synchronous operation)
const signed_send_psbt = senderWallet.signPsbt(sendPsbt);

// Step 3: Finalize transfer
const sendResult = await senderWallet.sendEnd({ 
    signed_psbt: signed_send_psbt 
});

// Alternative: Complete send in one call
const sendResult2 = await senderWallet.send({
    invoice: receiveData.invoice,
    fee_rate: 1,
    min_confirmations: 1
});

// Refresh both wallets to sync the transfer
await senderWallet.refreshWallet();
await receiverWallet.refreshWallet();
```

### Balance and Asset Management

```javascript
// Get BTC balance
const btcBalance = await wallet.getBtcBalance();

// List all assets
const assets = await wallet.listAssets();

// Get specific asset balance
const assetBalance = await wallet.getAssetBalance(assetId);

// List unspent UTXOs
const unspents = await wallet.listUnspents();

// List transactions
const transactions = await wallet.listTransactions();

// List transfers for specific asset
const transfers = await wallet.listTransfers(asset_id);
```

---

## Setup wallet and issue asset

```javascript
const { WalletManager, createWallet } = require('rgb-sdk');

async function demo() {
    // 1. Generate and initialize wallet
    const keys = await createWallet('regtest');
    const wallet = new WalletManager({
        xpub_van: keys.account_xpub_vanilla,
        xpub_col: keys.account_xpub_colored,
        master_fingerprint: keys.master_fingerprint,
        mnemonic: keys.mnemonic,
        network: 'regtest',
        rgb_node_endpoint: 'http://127.0.0.1:8000'
    });

    // 2. Register wallet
    await wallet.registerWallet();

    // 3. Get address and balance
    const address = await wallet.getAddress();

    // TODO: Send some BTC to this address for fees and UTXO creation
    const balance = await wallet.getBtcBalance();

    // 4. Create UTXOs 
    const psbt = await wallet.createUtxosBegin({
        up_to: true,
        num: 5,
        size: 1000,
        fee_rate: 1
    });
    const signed_psbt = wallet.signPsbt(psbt); // Synchronous operation
    const utxosCreated = await wallet.createUtxosEnd({ signed_psbt });

    // 5. Issue asset
    const asset = await wallet.issueAssetNia({
        ticker: "DEMO",
        name: "Demo Token",
        amounts: [1000],
        precision: 2
    });

    // 6. List assets and balances
    const assets = await wallet.listAssets();
    const assetBalance = await wallet.getAssetBalance(asset.asset?.asset_id);

    // Wallet is ready to send/receive RGB assets
}
```

---

##  Security

### Key Management

```javascript
const { createWallet, deriveKeysFromMnemonic } = require('rgb-sdk');

// Generate new wallet keys
const keys = await createWallet('testnet');
const mnemonic = keys.mnemonic;

// Store mnemonic securely for later restoration
// Use environment variables for production
const storedMnemonic = process.env.WALLET_MNEMONIC;

// Restore keys from mnemonic
const restoredKeys = await deriveKeysFromMnemonic('testnet', storedMnemonic);
```

---

## Full Examples

For complete working examples demonstrating all features, see:
- `example-flow.js` - Complete RGB wallet workflow with two wallets, asset issuance, and transfers
- `example-basic-usage.js` - Basic wallet operations and asset management
