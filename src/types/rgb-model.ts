
export type RGBHTTPClientParams ={ 
  xpub_van: string,
  xpub_col: string, 
  master_fingerprint:string,
  rgbEndpoint: string, 
}

export interface FailTransfersRequest {
  batch_transfer_idx: number
  no_asset_only?: boolean
  skip_sync?: boolean
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
export interface SendAssetBeginRequestModel {
  invoice: string;
  witness_data?: WitnessData;
  // recipient_map: Record<string, Recipient[]>;
  // donation?: boolean;            // default: false
  fee_rate?: number;             // default: 1
  min_confirmations?: number;    // default: 1
}

export interface SendAssetEndRequestModel {
  signed_psbt: string;
}
export interface RgbTransfer {
  idx: number;
  batch_transfer_idx: number;
  created_at: number;
  updated_at: number;
  status: TransferStatus;
  amount: number;
  kind: number;
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

interface Balance {
  settled: number
  future: number,
  spendable: number
}

export interface BtcBalance {
  vanilla: Balance,
  colored: Balance
}
export interface InvoiceReciveData {
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
  assetId?: string;

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
  issuedSupply?: number;

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
  addedAt?: number;

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
  asset_iface?: string;
  asset_id?: string;
  amount?: string;
  network: string;
  expiration_timestamp: number;
  transport_endpoints: string[];
}