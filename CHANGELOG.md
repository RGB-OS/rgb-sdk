# 2.0.0
__added__
- RGBLibClient: New local RGB client implementation using rgb-lib directly, eliminating the need for an RGB Node server
- generateKeys(network?): Top-level function to generate new wallet keys (mnemonic, xpubs, master fingerprint)
- restoreWallet(params): Top-level function to restore wallet from backup file to a target directory
- restoreFromBackup(params): High-level function to restore wallet from backup
- datadir parameter support in WalletInitParams for custom data directory paths
- createBackup(params): Create wallet backup with automatic master fingerprint-based filename (<masterFingerprint>.backup)
- Directory existence validation for backup paths
- sendBtcBegin(params): Begin Bitcoin send operation (returns PSBT)
- sendBtcEnd(params): Complete Bitcoin send operation with signed PSBT
- failTransfers(params): Mark transfers as failed
- deleteTransfers(params): Delete transfers from wallet
- createUtxos(params): All-in-one UTXO creation (alternative to begin/end pattern)
- RgbLibGeneratedKeys interface for generated keys structure
- Updated all request/response interfaces to use camelCase naming convention

__changed__
- Breaking: All TypeScript interfaces now use camelCase instead of snake_case to match rgb-lib c-ffi binding JSON serialization
- Breaking: Many methods changed from async/Promise<T> to synchronous T return types to match the underlying rgb-lib-wrapper.js API:
  - registerWallet(): Now synchronous
  - getBtcBalance(): Now synchronous
  - listAssets(): Now synchronous
  - listTransactions(): Now synchronous
  - listTransfers(): Now synchronous
  - restoreFromBackup(): Now synchronous
- Breaking: restoreWallet and restoreFromBackup moved from WalletManager class methods to top-level functions (must be called before creating wallet instance)
- Breaking: RGBLibClient constructor now requires dataDir and network as required parameters (no longer optional with defaults). WalletManager provides default temp dataDir if not specified
- Breaking: createBackup() now requires backupPath parameter and automatically appends master fingerprint to filename
- decodeRGBInvoice() now uses rgblib.Invoice class directly
- All request models updated to camelCase (e.g., fee_rate → feeRate, min_confirmations → minConfirmations)
- All response types updated to camelCase (e.g., batch_transfer_idx → batchTransferIdx, asset_id → assetId)

__fixed__
- sendBtcEnd now properly calls sendBtcEnd with online connection and skipSync parameter
- failTransfers implementation now properly calls underlying rgb-lib function
- Backup path construction now includes master fingerprint in filename
- RestoreWalletRequestModel now uses backupFilePath and dataDir instead of backup and restoreDir

__removed__
- Removed camelCase to snake_case conversion logic from rgb-lib-client.ts (responses now come as camelCase from rgb-lib)
- Removed downloadBackup() method

