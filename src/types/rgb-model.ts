import type { Readable } from 'stream';

export type RGBHTTPClientParams = {
  xpub_van: string;
  xpub_col: string;
  master_fingerprint: string;
  rgbEndpoint: string;
}

export interface FailTransfersRequest {
  batch_transfer_idx: number
  no_asset_only?: boolean
  skip_sync?: boolean
}

export interface WalletBackupResponse {
  message: string;
  download_url: string;
}

export interface WalletRestoreResponse {
  message: string;
}

export interface RestoreWalletRequestModel {
  backup: Buffer | Uint8Array | ArrayBuffer | Readable;
  password: string;
  filename?: string;
  xpub_van?: string;
  xpub_col?: string;
  master_fingerprint?: string;
}

export interface WitnessData {
  amount_sat: number;
  blinding?: number;
}
export interface InvoiceRequest {
  amount: number;
  asset_id: string;
}
export interface Recipient {
  recipient_id: string;
  witness_data?: WitnessData;
  amount: number;
  transport_endpoints: string[];
}
export interface IssueAssetNiaRequestModel { ticker: string; name: string; amounts: number[]; precision: number }

export interface IssueAssetIfaRequestModel {
  ticker: string;
  name: string;
  precision: number;
  amounts: number[];
  inflation_amounts: number[];
  replace_rights_num: number;
  reject_list_url?: string;
}
export interface SendAssetBeginRequestModel {
  invoice: string;
  witness_data?: WitnessData;
  asset_id?: string;
  amount?: number;
  // recipient_map: Record<string, Recipient[]>;
  // donation?: boolean;            // default: false
  fee_rate?: number;             // default: 1
  min_confirmations?: number;    // default: 1
}

export interface SendAssetEndRequestModel {
  signed_psbt: string;
}

export interface SendResult {
  txid: string;
  batch_transfer_idx: number;
}

export interface OperationResult {
  txid: string;
  batch_transfer_idx: number;
}

export interface CreateUtxosBeginRequestModel {
  up_to?: boolean;
  num?: number;
  size?: number;
  fee_rate?: number;
}

export interface CreateUtxosEndRequestModel {
  signed_psbt: string;
}

export interface InflateAssetIfaRequestModel {
  asset_id: string;
  inflation_amounts: number[];
  fee_rate?: number;
  min_confirmations?: number;
}

export interface InflateEndRequestModel {
  signed_psbt: string;
}

export interface SendBtcBeginRequestModel {
  address: string;
  amount: number;
  fee_rate: number;
  skip_sync?: boolean;
}
export interface SendBtcEndRequestModel {
  signed_psbt: string;
  skip_sync?: boolean;
}

export interface GetFeeEstimationRequestModel {
  blocks: number;
}

export type GetFeeEstimationResponse = Record<string, number> | number;

export enum TransactionType {
  RGB_SEND = 0,
  DRAIN = 1,
  CREATE_UTXOS = 2,
  USER = 3,
}

export interface BlockTime {
  height: number;
  timestamp: number;
}

export interface Transaction {
  transaction_type: TransactionType;
  txid: string;
  received: number;
  sent: number;
  fee: number;
  confirmation_time?: BlockTime;
}
enum TransferKind {
    ISSUANCE = 0,
    RECEIVE_BLIND = 1,
    RECEIVE_WITNESS = 2,
    SEND = 3,
    INFLATION = 4
  }
export interface RgbTransfer {
  idx: number;
  batch_transfer_idx: number;
  created_at: number;
  updated_at: number;
  status: TransferStatus;
  amount: number;
  kind: TransferKind;
  txid: string | null;
  recipient_id: string;
  receive_utxo: { txid: string; vout: number };
  change_utxo: { txid: string; vout: number } | null;
  expiration: number;
  transport_endpoints: {
    endpoint: string;
    transport_type: number;
    used: boolean;
  }[];
}

export enum TransferStatus {
  WAITING_COUNTERPARTY = 0,
  WAITING_CONFIRMATIONS,
  SETTLED,
  FAILED,
}
export interface Unspent {
  utxo: Utxo;
  rgb_allocations: RgbAllocation[];
}
export interface Utxo {
  outpoint: {
    txid: string;
    vout: number;
  };
  btc_amount: number;
  colorable: boolean;
}

export interface RgbAllocation {
  asset_id: string;
  amount: number;
  settled: boolean;
}

export interface Balance {
  settled: number
  future: number,
  spendable: number
}

export interface BtcBalance {
  vanilla: Balance,
  colored: Balance
}
export interface InvoiceReceiveData {
  invoice: string
  recipient_id: string
  expiration_timestamp: number
  batch_transfer_idx: number
}
export interface AssetNIA {

  /**
   * @type {string}
   * @memberof AssetNIA
   * @example rgb:2dkSTbr-jFhznbPmo-TQafzswCN-av4gTsJjX-ttx6CNou5-M98k8Zd
   */
  asset_id?: string;

  /**
   * @type {AssetIface}
   * @memberof AssetNIA
   */
  assetIface?: AssetIface;

  /**
   * @type {string}
   * @memberof AssetNIA
   * @example USDT
   */
  ticker?: string;

  /**
   * @type {string}
   * @memberof AssetNIA
   * @example Tether
   */
  name?: string;

  /**
   * @type {string}
   * @memberof AssetNIA
   * @example asset details
   */
  details?: string;

  /**
   * @type {number}
   * @memberof AssetNIA
   * @example 0
   */
  precision?: number;

  /**
   * @type {number}
   * @memberof AssetNIA
   * @example 777
   */
  issued_supply?: number;

  /**
   * @type {number}
   * @memberof AssetNIA
   * @example 1691160565
   */
  timestamp?: number;

  /**
   * @type {number}
   * @memberof AssetNIA
   * @example 1691161979
   */
  added_at?: number;

  /**
   * @type {BtcBalance}
   * @memberof AssetNIA
   */
  balance?: BtcBalance;

  /**
   * @type {Media}
   * @memberof AssetNIA
   */
  media?: Media;
}

export interface AssetIfa {
  asset_id: string;
  ticker: string;
  name: string;
  details?: string;
  precision: number;
  initial_supply: number;
  max_supply: number;
  known_circulating_supply: number;
  timestamp: number;
  added_at: number;
  balance: Balance;
  media?: Media;
  reject_list_url?: string;
}

export interface Media {

  /**
   * @type {string}
   * @memberof Media
   * @example /path/to/media
   */
  filePath?: string;

  /**
   * @type {string}
   * @memberof Media
   * @example text/plain
   */
  mime?: string;
}

export enum AssetIface {
  RGB20 = 'RGB20',
  RGB21 = 'RGB21',
  RGB25 = 'RGB25'
}

export enum AssetSchema {
  Nia = 'Nia',
  Uda = 'Uda',
  Cfa = 'Cfa'
}

/**
 * 
 *
 * @export
 * @interface ListAssetsResponse
 */
export interface ListAssetsResponse {

  /**
   * @type {Array<AssetNIA>}
   * @memberof ListAssetsResponse
   */
  nia?: Array<AssetNIA>;

  /**
   * @type {Array<AssetNIA>}
   * @memberof ListAssetsResponse
   */
  uda?: Array<AssetNIA>;

  /**
   * @type {Array<AssetNIA>}
   * @memberof ListAssetsResponse
   */
  cfa?: Array<AssetNIA>;
}
export interface IssueAssetNIAResponse {

  /**
   * @type {AssetNIA}
   * @memberof IssueAssetNIAResponse
   */
  asset?: AssetNIA;
}

/**
 * 
 *
 * @export
 * @interface AssetBalanceResponse
 */
export interface AssetBalanceResponse {

  /**
   * @type {number}
   * @memberof AssetBalanceResponse
   * @example 777
   */
  settled?: number;

  /**
   * @type {number}
   * @memberof AssetBalanceResponse
   * @example 777
   */
  future?: number;

  /**
   * @type {number}
   * @memberof AssetBalanceResponse
   * @example 777
   */
  spendable?: number;

  /**
   * @type {number}
   * @memberof AssetBalanceResponse
   * @example 444
   */
  offchainOutbound?: number;

  /**
   * @type {number}
   * @memberof AssetBalanceResponse
   * @example 0
   */
  offchainInbound?: number;
}

export interface DecodeRgbInvoiceResponse {
  recipient_id: string;
  asset_schema?: string;
  asset_id?: string;
  network: string;
  assignment: Assignment;
  assignment_name?: string;
  expiration_timestamp?: number;
  transport_endpoints: string[];
}

export interface Assignment {
  [key: string]: any;
}

/**
 * Response model for single-use deposit address.
 *
 * @export
 * @interface SingleUseDepositAddressResponse
 */
export interface SingleUseDepositAddressResponse {
  /**
   * @type {string}
   * @memberof SingleUseDepositAddressResponse
   */
  btc_address: string;

  /**
   * @type {string}
   * @memberof SingleUseDepositAddressResponse
   */
  asset_invoice: string;

  /**
   * @type {string}
   * @memberof SingleUseDepositAddressResponse
   */
  expires_at?: string;
}

/**
 * Response model for unused deposit addresses.
 *
 * @export
 * @interface UnusedDepositAddressesResponse
 */
export interface UnusedDepositAddressesResponse {
  /**
   * @type {Array<SingleUseDepositAddressResponse>}
   * @memberof UnusedDepositAddressesResponse
   */
  addresses: SingleUseDepositAddressResponse[];
}

/**
 * Model for offchain balance detail.
 *
 * @export
 * @interface OffchainBalanceDetail
 */
export interface OffchainBalanceDetail {
  /**
   * @type {string}
   * @memberof OffchainBalanceDetail
   */
  expiry_time: string;

  /**
   * @type {number}
   * @memberof OffchainBalanceDetail
   */
  amount: number;
}

/**
 * Model for offchain balance.
 *
 * @export
 * @interface OffchainBalance
 */
export interface OffchainBalance {
  /**
   * @type {number}
   * @memberof OffchainBalance
   */
  total: number;

  /**
   * @type {Array<OffchainBalanceDetail>}
   * @memberof OffchainBalance
   */
  details: OffchainBalanceDetail[];
}

/**
 * Response model for BTC balance.
 *
 * @export
 * @interface BtcBalanceResponse
 */
export interface BtcBalanceResponse {
  /**
   * @type {Balance}
   * @memberof BtcBalanceResponse
   */
  vanilla: Balance;

  /**
   * @type {Balance}
   * @memberof BtcBalanceResponse
   */
  colored: Balance;

  /**
   * @type {OffchainBalance}
   * @memberof BtcBalanceResponse
   */
  offchain_balance?: OffchainBalance;
}

/**
 * Model for asset balance details.
 *
 * @export
 * @interface AssetBalanceDetails
 */
export interface AssetBalanceDetails {
  /**
   * @type {number}
   * @memberof AssetBalanceDetails
   */
  settled: number;

  /**
   * @type {number}
   * @memberof AssetBalanceDetails
   */
  future: number;

  /**
   * @type {number}
   * @memberof AssetBalanceDetails
   */
  spendable: number;

  /**
   * @type {number}
   * @memberof AssetBalanceDetails
   */
  offchain_outbound?: number;
}

/**
 * Model for asset balance.
 *
 * @export
 * @interface AssetBalance
 */
export interface AssetBalance {
  /**
   * @type {string}
   * @memberof AssetBalance
   */
  asset_id: string;

  /**
   * @type {string}
   * @memberof AssetBalance
   */
  ticker?: string;

  /**
   * @type {number}
   * @memberof AssetBalance
   */
  precision: number;

  /**
   * @type {AssetBalanceDetails}
   * @memberof AssetBalance
   */
  balance: AssetBalanceDetails;
}

/**
 * Response model for wallet balance.
 *
 * @export
 * @interface WalletBalanceResponse
 */
export interface WalletBalanceResponse {
  /**
   * @type {BtcBalanceResponse}
   * @memberof WalletBalanceResponse
   */
  balance: BtcBalanceResponse;

  /**
   * @type {Array<AssetBalance>}
   * @memberof WalletBalanceResponse
   */
  asset_balances: AssetBalance[];
}

/**
 * Model for Lightning asset payment details.
 *
 * @export
 * @interface LightningAsset
 */
export interface LightningAsset {
  /**
   * @type {string}
   * @memberof LightningAsset
   */
  asset_id: string;

  /**
   * @type {number}
   * @memberof LightningAsset
   */
  amount: number;
}

/**
 * Response model for Lightning receive request.
 *
 * @export
 * @interface LightningReceiveRequest
 */
export interface LightningReceiveRequest {
  /**
   * @type {string}
   * @memberof LightningReceiveRequest
   */
  id: string;

  /**
   * @type {string}
   * @memberof LightningReceiveRequest
   */
  invoice: string;

  /**
   * @type {'OPEN' | 'SETTLED' | 'EXPIRED' | 'FAILED'}
   * @memberof LightningReceiveRequest
   */
  status: 'OPEN' | 'SETTLED' | 'EXPIRED' | 'FAILED';

  /**
   * @type {'BTC' | 'ASSET'}
   * @memberof LightningReceiveRequest
   */
  payment_type: 'BTC' | 'ASSET';

  /**
   * @type {number}
   * @memberof LightningReceiveRequest
   */
  amount_sats?: number;

  /**
   * @type {LightningAsset}
   * @memberof LightningReceiveRequest
   */
  asset?: LightningAsset;

  /**
   * @type {string}
   * @memberof LightningReceiveRequest
   */
  created_at: string;
}

/**
 * Response model for Lightning send request.
 *
 * @export
 * @interface LightningSendRequest
 */
export interface LightningSendRequest {
  /**
   * @type {string}
   * @memberof LightningSendRequest
   */
  id: string;

  /**
   * @type {'PENDING' | 'SUCCEEDED' | 'FAILED'}
   * @memberof LightningSendRequest
   */
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED';

  /**
   * @type {'BTC' | 'ASSET'}
   * @memberof LightningSendRequest
   */
  payment_type: 'BTC' | 'ASSET';

  /**
   * @type {number}
   * @memberof LightningSendRequest
   */
  amount_sats?: number;

  /**
   * @type {LightningAsset}
   * @memberof LightningSendRequest
   */
  asset?: LightningAsset;

  /**
   * @type {number}
   * @memberof LightningSendRequest
   */
  fee_sats?: number;

  /**
   * @type {string}
   * @memberof LightningSendRequest
   */
  created_at: string;
}

/**
 * Request model for creating Lightning invoice.
 *
 * @export
 * @interface CreateLightningInvoiceRequestModel
 */
export interface CreateLightningInvoiceRequestModel {
  /**
   * @type {number}
   * @memberof CreateLightningInvoiceRequestModel
   */
  amount_sats?: number;

  /**
   * @type {LightningAsset}
   * @memberof CreateLightningInvoiceRequestModel
   */
  asset?: LightningAsset;

  /**
   * @type {number}
   * @memberof CreateLightningInvoiceRequestModel
   */
  expiry_seconds?: number;
}

/**
 * Request model for Lightning fee estimate.
 *
 * @export
 * @interface GetLightningSendFeeEstimateRequestModel
 */
export interface GetLightningSendFeeEstimateRequestModel {
  /**
   * @type {string}
   * @memberof GetLightningSendFeeEstimateRequestModel
   */
  invoice: string;

  /**
   * @type {LightningAsset}
   * @memberof GetLightningSendFeeEstimateRequestModel
   */
  asset?: LightningAsset;
}

/**
 * Request model for paying a Lightning invoice.
 *
 * @export
 * @interface PayLightningInvoiceRequestModel
 */
export interface PayLightningInvoiceRequestModel {
  /**
   * @type {string}
   * @memberof PayLightningInvoiceRequestModel
   */
  invoice: string;

  /**
   * @type {number}
   * @memberof PayLightningInvoiceRequestModel
   */
  max_fee_sats: number;
}

/**
 * Request model for on-chain send from UTEXO.
 *
 * @export
 * @interface OnchainSendRequestModel
 */
export interface OnchainSendRequestModel {
  /**
   * @type {string}
   * @memberof OnchainSendRequestModel
   */
  address_or_rgbinvoice: string;

  /**
   * @type {number}
   * @memberof OnchainSendRequestModel
   */
  amount_sats?: number;

  /**
   * @type {number}
   * @memberof OnchainSendRequestModel
   */
  fee_rate: number;

  /**
   * @type {LightningAsset}
   * @memberof OnchainSendRequestModel
   */
  asset?: LightningAsset;
}

/**
 * Response model for on-chain send from UTEXO.
 *
 * @export
 * @interface OnchainSendResponse
 */
export interface OnchainSendResponse {
  /**
   * @type {string}
   * @memberof OnchainSendResponse
   */
  send_id: string;

  /**
   * @type {string}
   * @memberof OnchainSendResponse
   */
  txid?: string;
}

/**
 * On-chain send status enum.
 *
 * @export
 * @enum {string}
 */
export type OnchainSendStatus = string;

/**
 * Response model for getting on-chain send status.
 *
 * @export
 * @interface GetOnchainSendResponse
 */
export interface GetOnchainSendResponse {
  /**
   * @type {string}
   * @memberof GetOnchainSendResponse
   */
  send_id: string;

  /**
   * @type {OnchainSendStatus}
   * @memberof GetOnchainSendResponse
   */
  status: OnchainSendStatus;

  /**
   * @type {string}
   * @memberof GetOnchainSendResponse
   */
  address_or_rgbinvoice: string;

  /**
   * @type {number}
   * @memberof GetOnchainSendResponse
   */
  amount_sats_requested?: number;

  /**
   * @type {number}
   * @memberof GetOnchainSendResponse
   */
  amount_sats_sent?: number;

  /**
   * @type {LightningAsset}
   * @memberof GetOnchainSendResponse
   */
  asset?: LightningAsset;

  /**
   * @type {Array<string>}
   * @memberof GetOnchainSendResponse
   */
  close_txids: string[];

  /**
   * @type {string}
   * @memberof GetOnchainSendResponse
   */
  sweep_txid?: string;

  /**
   * @type {number}
   * @memberof GetOnchainSendResponse
   */
  fee_sats?: number;

  /**
   * @type {Record<string, number>}
   * @memberof GetOnchainSendResponse
   */
  timestamps: Record<string, number>;

  /**
   * @type {string}
   * @memberof GetOnchainSendResponse
   */
  error_code?: string;

  /**
   * @type {string}
   * @memberof GetOnchainSendResponse
   */
  error_message?: string;

  /**
   * @type {boolean}
   * @memberof GetOnchainSendResponse
   */
  retryable: boolean;
}

/**
 * HTLC status enum.
 *
 * @export
 * @enum {string}
 */
export type HTLCStatus = 'Pending' | 'Succeeded' | 'Failed';

/**
 * Payment model for Lightning payments.
 *
 * @export
 * @interface Payment
 */
export interface Payment {
  /**
   * @type {number}
   * @memberof Payment
   */
  amt_msat: number;

  /**
   * @type {number}
   * @memberof Payment
   */
  asset_amount?: number;

  /**
   * @type {string}
   * @memberof Payment
   */
  asset_id?: string;

  /**
   * @type {string}
   * @memberof Payment
   */
  payment_hash: string;

  /**
   * @type {boolean}
   * @memberof Payment
   */
  inbound: boolean;

  /**
   * @type {HTLCStatus}
   * @memberof Payment
   */
  status: HTLCStatus;

  /**
   * @type {number}
   * @memberof Payment
   */
  created_at: number;

  /**
   * @type {number}
   * @memberof Payment
   */
  updated_at: number;

  /**
   * @type {string}
   * @memberof Payment
   */
  payee_pubkey?: string;
}

/**
 * Response model for listing Lightning payments.
 *
 * @export
 * @interface ListLightningPaymentsResponse
 */
export interface ListLightningPaymentsResponse {
  /**
   * @type {Array<Payment>}
   * @memberof ListLightningPaymentsResponse
   */
  payments: Payment[];
}