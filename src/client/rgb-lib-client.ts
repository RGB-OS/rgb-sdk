/**
 * RGB Lib Client - Local client using rgb-lib directly instead of HTTP server
 * 
 * This client provides the same interface as RGBClient but uses rgb-lib locally
 * without requiring an RGB Node server.
 */
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import type { Readable } from 'stream';

/**
 * Default transport endpoint for RGB protocol
 */
const DEFAULT_TRANSPORT_ENDPOINT = 'rpcs://proxy.iriswallet.com/0.2/json-rpc';
import {
  AssetBalanceResponse,
  BtcBalance,
  CreateUtxosBeginRequestModel,
  CreateUtxosEndRequestModel,
  FailTransfersRequest,
  InvoiceReceiveData,
  InvoiceRequest,
  IssueAssetNIAResponse,
  ListAssetsResponse,
  RGBHTTPClientParams,
  RgbTransfer,
  SendAssetBeginRequestModel,
  SendAssetEndRequestModel,
  SendResult,
  Transaction,
  Unspent,
  WalletBackupResponse,
  WalletRestoreResponse,
  SendBtcBeginRequestModel,
  SendBtcEndRequestModel,
  GetFeeEstimationRequestModel,
  GetFeeEstimationResponse,
  AssetNIA,
  IssueAssetIfaRequestModel,
  AssetIfa,
  InflateAssetIfaRequestModel,
  InflateEndRequestModel,
  OperationResult,
  DecodeRgbInvoiceResponse
} from '../types/rgb-model';
import { ValidationError, WalletError, CryptoError } from '../errors';
import { normalizeNetwork } from '../utils/validation';
import type { Network } from '../crypto/types';

let rgbLib: any;
try {
  rgbLib = require('rgb-lib');
} catch (error) {
  throw new CryptoError('Failed to load rgb-lib-wrapper. Make sure rgb-lib is properly installed.', error as Error);
}

/**
 * Map network from client format to rgb-lib format
 */
function mapNetworkToRgbLib(network: Network): string {
  const networkMap: Record<Network, string> = {
    'mainnet': 'Mainnet',
    'testnet': 'Testnet',
    'signet': 'Signet',
    'regtest': 'Regtest',
  };
  return networkMap[network] || 'Regtest';
}

/**
 * Map network from rgb-lib format to client format
 */
function mapNetworkFromRgbLib(network: string): Network {
  const networkMap: Record<string, Network> = {
    'Mainnet': 'mainnet',
    'Testnet': 'testnet',
    'Testnet4': 'testnet',
    'Signet': 'signet',
    'Regtest': 'regtest',
  };
  return networkMap[network] || 'regtest';
}

/**
 * RGB Lib Client class - Local implementation using rgb-lib
 */
export class RGBLibClient {
  private wallet: any;
  private online: any | null = null;
  private readonly xpubVan: string;
  private readonly xpubCol: string;
  private readonly masterFingerprint: string;
  private readonly network: Network;
  private readonly dataDir: string;
  private readonly transportEndpoint: string;
  private readonly indexerUrl: string;

  constructor(params: {
    xpub_van: string;
    xpub_col: string;
    master_fingerprint: string;
    dataDir?: string;
    network?: string | number;
    transportEndpoint?: string;
    indexerUrl?: string;
  }) {
    this.xpubVan = params.xpub_van;
    this.xpubCol = params.xpub_col;
    this.masterFingerprint = params.master_fingerprint;
    this.network = normalizeNetwork(params.network || 'regtest');
    
    this.dataDir = params.dataDir || path.join(os.tmpdir(), 'rgb-wallet', this.masterFingerprint);
    this.transportEndpoint = params.transportEndpoint || DEFAULT_TRANSPORT_ENDPOINT;
    
    if (params.indexerUrl) {
      this.indexerUrl = params.indexerUrl;
    } else {
      const defaultIndexerUrls: Record<Network, string> = {
        'mainnet': 'ssl://electrum.iriswallet.com:50003',
        'testnet': 'ssl://electrum.iriswallet.com:50013',
        'signet': 'tcp://46.224.75.237:50001',
        'regtest': 'tcp:/regtest.thunderstack.org:50001',
      };
      this.indexerUrl = defaultIndexerUrls[this.network] || defaultIndexerUrls['regtest'];
    }

    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    const walletData = {
      dataDir: this.dataDir,
      bitcoinNetwork: mapNetworkToRgbLib(this.network),
      databaseType: 'Sqlite',
      accountXpubVanilla: this.xpubVan,
      accountXpubColored: this.xpubCol,
      maxAllocationsPerUtxo: 1,
      vanillaKeychain: undefined,
    };

    try {
      this.wallet = new rgbLib.Wallet(walletData);
    } catch (error) {
      throw new WalletError('Failed to initialize rgb-lib wallet', undefined, error as Error);
    }
  }

  /**
   * Ensure online connection is established
   */
  private async ensureOnline(): Promise<void> {
    if (this.online) {
      return;
    }

    try {
      this.online = this.wallet.goOnline(false, this.indexerUrl);
    } catch (error) {
      throw new WalletError('Failed to establish online connection', undefined, error as Error);
    }
  }

  /**
   * Get online object, creating it if needed
   */
  private async getOnline(): Promise<any> {
    await this.ensureOnline();
    return this.online;
  }

  async registerWallet(): Promise<{ address: string; btc_balance: BtcBalance }> {
    const online = await this.getOnline();
    const address = this.wallet.getAddress();
    const btcBalance = JSON.parse(this.wallet.getBtcBalance(online, false));
    
    return {
      address,
      btc_balance: btcBalance,
    };
  }

  async getBtcBalance(): Promise<BtcBalance> {
    const online = await this.getOnline();
    return JSON.parse(this.wallet.getBtcBalance(online, false));
  }

  async getAddress(): Promise<string> {
    return this.wallet.getAddress();
  }

  async listUnspents(): Promise<Unspent[]> {
    const online = await this.getOnline();
    return JSON.parse(this.wallet.listUnspents(online, false, false));
  }

  async createUtxosBegin(params: CreateUtxosBeginRequestModel): Promise<string> {
    const online = await this.getOnline();
    const upTo = params.up_to ?? false;
    const num = params.num;
    const size = params.size;
    const feeRate = params.fee_rate ? String(params.fee_rate) : '1';
    const skipSync = false;

    const psbt = this.wallet.createUtxos(online, upTo, num, size, feeRate, skipSync);
    return psbt;
  }

  async createUtxosEnd(params: CreateUtxosEndRequestModel): Promise<number> {
    try {
      return 1;
    } catch (error) {
      throw new WalletError('Failed to process createUtxosEnd', undefined, error as Error);
    }
  }

  async sendBegin(params: SendAssetBeginRequestModel): Promise<string> {
    const online = await this.getOnline();
    
    const feeRate = params.fee_rate ? String(params.fee_rate) : '1';
    const minConfirmations = params.min_confirmations ?? 1;
    const skipSync = false;
    const donation = false;

    let assetId: string | undefined = params.asset_id;
    let amount: number | undefined = params.amount;
    let recipientId: string | undefined;
    let transportEndpoints: string[] = [];

    if (params.invoice) {
      const invoiceStr = params.invoice;
      
      if (invoiceStr.startsWith('rgb:')) {
        recipientId = invoiceStr;
      } else {
        try {
          const parsed = JSON.parse(invoiceStr);
          recipientId = parsed.recipient_id || invoiceStr;
          transportEndpoints = parsed.transport_endpoints || [];
          assetId = parsed.asset_id || assetId;
        } catch {
          recipientId = invoiceStr;
        }
      }
    }

    if (transportEndpoints.length === 0) {
      transportEndpoints = [this.transportEndpoint];
    }

    if (!assetId) {
      throw new ValidationError('asset_id is required for send operation', 'asset_id');
    }

    if (!recipientId) {
      throw new ValidationError('Could not extract recipient_id from invoice', 'invoice');
    }

    if (!amount && params.witness_data?.amount_sat) {
      amount = params.witness_data.amount_sat;
    }

    if (!amount) {
      throw new ValidationError('amount is required for send operation', 'amount');
    }

    const recipientMap: Record<string, any[]> = {
      [assetId]: [{
        recipient_id: recipientId,
        amount: String(amount),
        transport_endpoints: transportEndpoints,
      }],
    };

    const result = this.wallet.send(
      online,
      recipientMap,
      donation,
      feeRate,
      minConfirmations,
      skipSync
    );

    if (typeof result === 'string') {
      if (result.startsWith('cHNidP8') || result.length > 100) {
        return result;
      }
      
      try {
        const parsedResult = JSON.parse(result);
        return parsedResult.psbt || 
               parsedResult.unsigned_psbt || 
               parsedResult.unsignedPsbt ||
               parsedResult.psbt_base64 ||
               result;
      } catch {
        return result;
      }
    }
    
    return typeof result === 'object' ? JSON.stringify(result) : String(result);
  }

  async sendEnd(params: SendAssetEndRequestModel): Promise<SendResult> {
    return {
      txid: '',
      batch_transfer_idx: 0,
    };
  }

  async sendBtcBegin(params: SendBtcBeginRequestModel): Promise<string> {
    const online = await this.getOnline();
    const address = params.address;
    const amount = String(params.amount);
    const feeRate = String(params.fee_rate);
    const skipSync = params.skip_sync ?? false;

    const psbt = this.wallet.sendBtc(online, address, amount, feeRate, skipSync);
    return psbt;
  }

  async sendBtcEnd(params: SendBtcEndRequestModel): Promise<string> {
    return params.signed_psbt;
  }

  async getFeeEstimation(params: GetFeeEstimationRequestModel): Promise<GetFeeEstimationResponse> {
    const online = await this.getOnline();
    const blocks = params.blocks;
    
    const result = this.wallet.getFeeEstimation(online, blocks);
    
    if (typeof result === 'string') {
      try {
        return JSON.parse(result);
      } catch {
        return result as unknown as GetFeeEstimationResponse;
      }
    }
    
    return result;
  }

  async blindReceive(params: InvoiceRequest): Promise<InvoiceReceiveData> {
    const assetId = params.asset_id || null;
    const assignment = String(params.amount);
    const durationSeconds = undefined;
    const transportEndpoints: string[] = [this.transportEndpoint];
    const minConfirmations = 1;

    const result = this.wallet.blindReceive(
      assetId,
      assignment,
      durationSeconds,
      transportEndpoints,
      minConfirmations
    );

    return JSON.parse(result);
  }

  async witnessReceive(params: InvoiceRequest): Promise<InvoiceReceiveData> {
    const assetId = params.asset_id || null;
    const assignment = String(params.amount);
    const durationSeconds = undefined;
    const transportEndpoints: string[] = [this.transportEndpoint];
    const minConfirmations = 1;

    const result = this.wallet.witnessReceive(
      assetId,
      assignment,
      durationSeconds,
      transportEndpoints,
      minConfirmations
    );

    return JSON.parse(result);
  }

  async getAssetBalance(asset_id: string): Promise<AssetBalanceResponse> {
    return JSON.parse(this.wallet.getAssetBalance(asset_id));
  }

  async issueAssetNia(params: { ticker: string; name: string; amounts: number[]; precision: number }): Promise<AssetNIA> {
    const ticker = params.ticker;
    const name = params.name;
    const precision = params.precision;
    const amounts = params.amounts.map(a => String(a));

    const result = this.wallet.issueAssetNIA(ticker, name, precision, amounts);
    return JSON.parse(result);
  }

  async issueAssetIfa(params: IssueAssetIfaRequestModel): Promise<AssetIfa> {
    throw new ValidationError('issueAssetIfa is not fully supported in rgb-lib. Use RGB Node server for IFA assets.', 'asset');
  }

  async inflateBegin(params: InflateAssetIfaRequestModel): Promise<string> {
    throw new ValidationError('inflateBegin is not fully supported in rgb-lib. Use RGB Node server for inflation operations.', 'asset');
  }

  async inflateEnd(params: InflateEndRequestModel): Promise<OperationResult> {
    throw new ValidationError('inflateEnd is not fully supported in rgb-lib. Use RGB Node server for inflation operations.', 'asset');
  }

  async listAssets(): Promise<ListAssetsResponse> {
    const filterAssetSchemas: string[] = [];
    const result = this.wallet.listAssets(filterAssetSchemas);
    return JSON.parse(result);
  }

  async decodeRGBInvoice(params: { invoice: string }): Promise<DecodeRgbInvoiceResponse> {
    throw new ValidationError('decodeRGBInvoice is not directly supported in rgb-lib. Use RGB Node server for invoice decoding.', 'invoice');
  }

  async refreshWallet(): Promise<void> {
    const online = await this.getOnline();
    const assetId = null;
    const filter: string[] = [];
    const skipSync = false;

    this.wallet.refresh(online, assetId, filter, skipSync);
  }

  async dropWallet(): Promise<void> {
    if (this.online) {
      rgbLib.dropOnline(this.online);
      this.online = null;
    }
    if (this.wallet) {
      this.wallet.drop();
      this.wallet = null;
    }
  }

  async listTransactions(): Promise<Transaction[]> {
    const online = await this.getOnline();
    const skipSync = false;
    return JSON.parse(this.wallet.listTransactions(online, skipSync));
  }

  async listTransfers(asset_id: string): Promise<RgbTransfer[]> {
    return JSON.parse(this.wallet.listTransfers(asset_id));
  }

  async failTransfers(params: FailTransfersRequest): Promise<boolean> {
    throw new ValidationError('failTransfers is not directly supported in rgb-lib. Use RGB Node server for this operation.', 'transfers');
  }

  async syncWallet(): Promise<void> {
    const online = await this.getOnline();
    this.wallet.sync(online);
  }

  async createBackup(params: { password: string }): Promise<WalletBackupResponse> {
    const backupPath = path.join(this.dataDir, `backup-${Date.now()}.zip`);
    this.wallet.backup(backupPath, params.password);
    
    const backupInfo = this.wallet.backupInfo();
    
    return {
      message: 'Backup created successfully',
      download_url: backupPath,
    };
  }

  async downloadBackup(backupId?: string): Promise<ArrayBuffer | Buffer> {
    const backupPath = backupId || path.join(this.dataDir, `backup-${this.xpubVan}.zip`);
    
    if (!fs.existsSync(backupPath)) {
      throw new ValidationError('Backup file not found', 'backup');
    }

    return fs.readFileSync(backupPath);
  }

  async restoreWallet(params: {
    file: Buffer | Uint8Array | ArrayBuffer | Readable;
    password: string;
    xpub_van?: string;
    xpub_col?: string;
    master_fingerprint?: string;
    filename?: string;
  }): Promise<WalletRestoreResponse> {
    let fileBuffer: Buffer;
    if (params.file instanceof Buffer) {
      fileBuffer = params.file;
    } else if (params.file instanceof Uint8Array) {
      fileBuffer = Buffer.from(params.file);
    } else if (params.file instanceof ArrayBuffer) {
      fileBuffer = Buffer.from(params.file);
    } else {
      const chunks: Buffer[] = [];
      for await (const chunk of params.file) {
        chunks.push(Buffer.from(chunk));
      }
      fileBuffer = Buffer.concat(chunks);
    }

    const tempBackupPath = path.join(os.tmpdir(), `restore-${Date.now()}.zip`);
    fs.writeFileSync(tempBackupPath, fileBuffer);

    const targetDir = this.dataDir;
    rgbLib.restoreBackup(tempBackupPath, params.password, targetDir);

    fs.unlinkSync(tempBackupPath);

    return {
      message: 'Wallet restored successfully',
    };
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.dropWallet();
  }
}

