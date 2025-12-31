# Release Notes Summary

## New Features

### Deposit & UTEXO API

Added new API endpoints for managing deposits and UTEXO operations:

- **`getSingleUseDepositAddress()`** - Retrieves a single-use deposit address for receiving assets. Returns a BTC address and asset invoice that can be used once for deposits.
- **`getBalance()`** - Returns comprehensive wallet balance including BTC balance (vanilla, colored, and offchain) and all asset balances with detailed breakdown (settled, future, spendable, offchain_outbound).
- **`settle()`** - Settles balances in the wallet, processing pending transactions and updating wallet state.

### Lightning Network API

Complete Lightning Network integration for both BTC and asset payments:

- **`createLightningInvoice()`** - Creates Lightning invoices for receiving BTC or asset payments. Supports optional expiry time configuration.
- **`getLightningReceiveRequest(id)`** - Retrieves the status of a Lightning invoice by request ID. Returns invoice details including status (OPEN, SETTLED, EXPIRED, FAILED), payment type, and amounts.
- **`getLightningSendRequest(id)`** - Retrieves the status of a Lightning payment by request ID. Returns payment details including status (PENDING, SUCCEEDED, FAILED), fees, and transaction information.
- **`getLightningSendFeeEstimate()`** - Estimates the routing fee required to pay a Lightning invoice. For asset payments, the fee is always denominated in satoshis.
- **`payLightningInvoiceBegin()`** - Begins a Lightning invoice payment process, returning a PSBT for signing.
- **`payLightningInvoiceEnd()`** - Completes a Lightning invoice payment using a signed PSBT.
- **`payLightningInvoice()`** - Convenience method that combines begin, sign, and end operations for paying Lightning invoices.

### Withdrawal API

New withdrawal functionality for moving funds from UTEXO layer back to Bitcoin L1:

- **`withdrawBegin()`** - Begins a withdrawal process from UTEXO, returning a PSBT for signing.
- **`withdrawEnd()`** - Completes a withdrawal from UTEXO using a signed PSBT.
- **`withdraw()`** - Convenience method that combines begin, sign, and end operations for withdrawing BTC or assets from UTEXO to Bitcoin L1.

## Type Definitions

Added comprehensive TypeScript type definitions for all new APIs:

- `SingleUseDepositAddressResponse` - Response model for single-use deposit addresses
- `WalletBalanceResponse` - Comprehensive wallet balance response
- `BtcBalanceResponse` - BTC balance breakdown (vanilla, colored, offchain)
- `OffchainBalance` - Offchain balance details with expiry information
- `AssetBalance` - Asset balance information with precision and ticker
- `AssetBalanceDetails` - Detailed asset balance breakdown
- `LightningReceiveRequest` - Lightning invoice response model
- `LightningSendRequest` - Lightning payment response model
- `LightningAsset` - Lightning asset payment details
- `CreateLightningInvoiceRequestModel` - Request model for creating Lightning invoices
- `GetLightningSendFeeEstimateRequestModel` - Request model for fee estimation
- `PayLightningInvoiceRequestModel` - Request model for paying Lightning invoices
- `WithdrawFromUTEXORequestModel` - Request model for withdrawals
- `WithdrawFromUTEXOResponse` - Withdrawal response model

## Documentation

- Updated README with comprehensive usage examples for all new APIs
- Added detailed JSDoc comments for all new methods
- Included examples for both convenience methods and manual flow operations
- Added new sections: "Deposit & UTEXO API", "Lightning API", and "Withdrawal API"

## Implementation Details

- All new methods are available in both `RGBClient` (low-level) and `WalletManager` (high-level) classes
- Convenience methods (`payLightningInvoice`, `withdraw`) automatically handle the begin → sign → end flow
- Manual flow methods allow for custom signing logic and step-by-step control
- All methods include proper error handling and TypeScript type safety
- PSBT signing is currently mocked (passes through) for Lightning and withdrawal operations, ready for future implementation

## Breaking Changes

None - all changes are additive and backward compatible.

