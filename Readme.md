
# SDK Overview

This is the underlying SDK used by the official **RGB Client Server**. It provides a complete set of TypeScript/Node.js bindings for interacting with the **RGB Node** and managing RGB-based transfers.

---

## 🧰 What You Can Do with This Library

With this SDK, developers can:

- Generate RGB invoices
- Create and manage UTXOs
- Sign PSBTs using local private keys or hardware signing flows
- Fetch asset balances, transfer status, and other RGB-related state

---


## ⚙️ Capabilities of `rgb-connect-nodejs` (via `WalletManager`)

| Method | Description |
|--------|-------------|
| `generateKeys()` | Generate wallet keypair with mnemonic/xpub/xprv |
| `registerWallet()` | Register wallet with the RGB Node |
| `getBtcBalance()` | Get on-chain BTC balance |
| `getAddress()` | Get a derived deposit address |
| `listUnspents()` | List unspent UTXOs |
| `listAssets()` | List RGB assets held |
| `getAssetBalance(assetId)` | Get balance for a specific asset |
| `createUtxosBegin(params)` | Start creating new UTXOs |
| `createUtxosEnd({ signedPsbt })` | Finalize UTXO creation with a signed PSBT |
| `blindRecive({ asset_id, amount })` | Generate blinded UTXO for receiving |
| `issueAssetNia({...})` | Issue a new Non-Inflationary Asset |
| `signPsbt({ psbtBase64, mnemonic })` | Sign PSBT using mnemonic and BDK |
| `refreshWallet()` | Sync and refresh wallet state |
| `listTransactions()` | List BTC-level transactions |
| `listTransfers(assetId)` | List RGB transfer history for asset |
| `failTransfers(...)` | Mark expired transfers as failed |
| `sendBegin(...)` | Prepare a transfer (build unsigned PSBT) |
| `sendEnd(...)` | Submit signed PSBT to complete transfer |
| `send(...)` | Internal backend method that automates `sendBegin` + `signPsbt` + `sendEnd` (should not be exposed to client) |

---

## 🧩 Notes for Custom Integration

- All communication with the RGB Node is handled via HTTP API calls encapsulated in the `ThunderLink` class.
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
npm install rgb-connect-nodejs
```

### Basic Usage

```javascript
const { wallet, createWallet } = require('rgb-connect-nodejs');

// 1. Generate wallet keys
const keys = createWallet();
console.log('Master Fingerprint:', keys.masterFingerprint);

// 2. Initialize wallet
wallet.init({
    xpub_van: keys.accountXpubVanilla,
    xpub_col: keys.accountXpubColored,
    master_fingerprint: keys.masterFingerprint,
    mnemonic: keys.mnemonic,
    network: "3", // Regtest
    rgbEndpoint: "http://127.0.0.1:8000"
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
// Generate new wallet keys
const keys = createWallet();

// Initialize wallet with keys
wallet.init({
    xpub_van: keys.accountXpubVanilla,
    xpub_col: keys.accountXpubColored,
    master_fingerprint: keys.masterFingerprint,
    mnemonic: keys.mnemonic,
    network: "3", // 1=Mainnet, 2=Testnet, 3=Regtest
    rgbEndpoint: "http://127.0.0.1:8000"
});

// Register wallet with RGB Node
await wallet.registerWallet();
```

### UTXO Management

```javascript
// Step 1: Begin UTXO creation
const psbt = await wallet.createUtxosBegin({
    upTo: true,
    num: 5,
    size: 1000,
    feeRate: 1
});

// Step 2: Sign the PSBT
const signedPsbt = await wallet.signPsbt(psbt);

// Step 3: Finalize UTXO creation
const utxosCreated = await wallet.createUtxosEnd({ signedPsbt });
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
const receiveData = await receiverWallet.blindRecive({
    asset_id: assetId,
    amount: 100
});

// Step 1: Begin asset transfer
const sendPsbt = await senderWallet.sendBegin({
    invoice: receiveData.invoice,
    fee_rate: 1,
    min_confirmations: 1
});

// Step 2: Sign the PSBT
const signedSendPsbt = await senderWallet.signPsbt(sendPsbt);

// Step 3: Finalize transfer
const sendResult = await senderWallet.sendEnd({ 
    signed_psbt: signedSendPsbt 
});


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
const transfers = await wallet.listTransfers(assetId);
```

---

## Setup wallet and issue asset

```javascript
const { wallet, createWallet } = require('rgb-connect-nodejs');

async function demo() {
    // 1. Generate and initialize wallet
    const keys = createWallet();
    wallet.init({
        xpub_van: keys.accountXpubVanilla,
        xpub_col: keys.accountXpubColored,
        master_fingerprint: keys.masterFingerprint,
        mnemonic: keys.mnemonic,
        network: "3",
        rgbEndpoint: "http://127.0.0.1:8000"
    });

    // 2. Register wallet
    await wallet.registerWallet();

    // 3. Get address and balance
    const address = await wallet.getAddress();

    // TODO: Send some BTC to this address for fees and UTXO creation
    const balance = await wallet.getBtcBalance();

    // 4. Create UTXOs 
    const psbt = await wallet.createUtxosBegin({
        upTo: true,
        num: 5,
        size: 1000,
        feeRate: 1
    });
    const signedPsbt = await wallet.signPsbt(psbt);
    const utxosCreated = await wallet.createUtxosEnd({ signedPsbt });

    // 5. Issue asset
    const asset = await wallet.issueAssetNia({
        ticker: "DEMO",
        name: "Demo Token",
        amounts: [1000],
        precision: 2
    });

    // 6. List assets and balances
    const assets = await wallet.listAssets();
    const assetBalance = await wallet.getAssetBalance(asset.asset?.assetId);

    // Wallet is ready to send/recive RGB assets
}
```

---

##  Security

### Key Management

```javascript
// Store mnemonic securely
const keys = createWallet();
const mnemonic = keys.mnemonic;

// Use environment variables for production
const mnemonic = process.env.WALLET_MNEMONIC;
```

---

## Full Examples

For complete working examples demonstrating all features, see:
- `example-flow.js` - Complete RGB wallet workflow with two wallets, asset issuance, and transfers
- `example-basic-usage.js` - Basic wallet operations and asset management
