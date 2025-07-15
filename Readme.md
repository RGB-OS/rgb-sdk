
# `rgb-connect-nodejs` SDK Overview

This is the underlying SDK used by the official **ThunderLink RGB Client Server**. It provides a complete set of TypeScript/Node.js bindings for interacting with the **ThunderLink RGB Manager** and managing RGB-based transfers.

---

## 🧰 What You Can Do with This Library

With this SDK, developers can:

- Generate RGB invoices
- Create and manage UTXOs
- Sign PSBTs using local private keys or hardware signing flows
- Fetch asset balances, transfer status, and other RGB-related state

---

## 🔧 When to Use a Custom Server

You might consider building your own RGB Client Server using this SDK if:

- You need to integrate with an existing wallet infrastructure
- You want to expose a different API surface to your frontend SDK
- You are integrating deeply with other financial systems or order management logic
- You want to apply non-standard business rules or policy enforcement
- You’re running a large-scale exchange or payment platform and require full control over infrastructure, monitoring, and debugging

---

## ⚙️ Capabilities of `rgb-connect-nodejs` (via `WalletManager`)

| Method | Description |
|--------|-------------|
| `generateKeys()` | Generate wallet keypair with mnemonic/xpub/xprv |
| `registerWallet()` | Register wallet with the RGB Manager |
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

## 🔄 RGB Asset Transfer Flow

To send an RGB asset using a PSBT flow:

### 1. Prepare Transfer (PSBT)
Call `sendBegin(params)` with a `recipient_map`, fee rate, and optional donation flag. This returns an unsigned PSBT.

### 2. Sign PSBT
Use `signPsbt({ psbtBase64, mnemonic })` to sign the PSBT using the wallet's private key derived from the mnemonic.

### 3. Finalize Transfer
Submit the signed PSBT via `sendEnd({ signed_psbt })` to complete the transfer.

> 💡 The `send()` method automates this three-step flow, making it easier to programmatically send assets in one function call.  
> ⚠️ **Note:** This method is intended to be used internally on the backend only, after all transfer requirements (such as sufficient balance, recipient validation, and policy checks) have been verified. It should not be exposed to client-side logic.

---

## 🧩 Notes for Custom Integration

- All communication with the ThunderLink RGB Manager is handled via HTTP API calls encapsulated in the `ThunderLink` class.
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
