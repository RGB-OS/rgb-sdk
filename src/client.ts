// src/index.ts
import { createClient } from "./http";
import { AssetBalanceResponse, BtcBalance, FailTransfersRequest, InvoiceReciveData, InvoiceRequest, IssueAssetNIAResponse, ListAssetsResponse, RGBHTTPClientParams, RgbTransfer, SendAssetBeginRequestModel, SendAssetEndRequestModel, Unspent } from "./types/rgb-model";


export class ThunderLink {
  private client;

  constructor(params: RGBHTTPClientParams) {
    this.client = createClient(params);
  }

  async registerWallet(): Promise<{ address: string, btc_balance: BtcBalance }> {
    const { data } = await this.client.post("/wallet/register");
    return data;
  }

  async getBtcBalance(): Promise<BtcBalance> {
    const { data } = await this.client.post("/wallet/btcbalance");
    return data;
  }
  async getAddress(): Promise<string> {
    const { data } = await this.client.post("/wallet/address");
    return data;
  }

  async listUnspents(): Promise<Unspent[]> {
    const { data } = await this.client.post("/wallet/listunspents");
    return data;
  }

  async createUtxosBegin(params: { upTo?: boolean; num?: number; size?: number; feeRate?: number }): Promise<string> {
    const { data } = await this.client.post("/wallet/createutxosbegin", params);
    return data;
  }

  async createUtxosEnd(params: { signedPsbt: string }): Promise<number> {
    const { data } = await this.client.post("/wallet/createutxosend", params);
    return data;
  }

  async sendBegin(params: SendAssetBeginRequestModel): Promise<string> {
    const { data } = await this.client.post("/wallet/sendbegin", params);
    return data;
  }

  async sendEnd(params: SendAssetEndRequestModel): Promise<string> {
    const { data } = await this.client.post("/wallet/sendend", params);
    return data;
  }

  async blindRecive(params: InvoiceRequest): Promise<InvoiceReciveData> {
    const { data } = await this.client.post("/wallet/blindreceive", params);
    return data;
  }

  async withessRecive(params: InvoiceRequest): Promise<InvoiceReciveData> {
    const { data } = await this.client.post("/wallet/witnessreceive", params);
    return data;
  }

  async getAssetBalance(assetId: string): Promise<AssetBalanceResponse> {
    const { data } = await this.client.post("/wallet/assetbalance", { assetId });
    return data;
  }
  async issueAssetNia(params: { ticker: string; name: string, amounts: number[]; precision: number; }): Promise<IssueAssetNIAResponse> {
    const { data } = await this.client.post("/wallet/issueassetnia", params);
    return data;
  }

  async listAssets(): Promise<ListAssetsResponse> {
    const { data } = await this.client.post("/wallet/listassets");
    return data;
  }
  async decodeRGBInvoice(params: { invoice: string }): Promise<SendAssetBeginRequestModel> {
    const { data } = await this.client.post("/wallet/decodergbinvoice", params);
    return data;
  }

  async refreshWallet() {
    const { data } = await this.client.post("/wallet/refresh");
    return data;
  }

  async dropWallet() {
    const { data } = await this.client.post("/wallet/drop");
    return data;
  }

  async listTransactions() {
    const { data } = await this.client.post("/wallet/listtransactions");
    return data;
  }
  async listTransfers(asset_id: string): Promise<RgbTransfer[]> {
    const { data } = await this.client.post("/wallet/listtransfers", { asset_id });
    return data;
  }
  async failTransfers(params: FailTransfersRequest): Promise<boolean> {
    const { batch_transfer_idx, no_asset_only = false, skip_sync = false } = params;
    const { data } = await this.client.post("/wallet/failtransfers", { batch_transfer_idx, no_asset_only, skip_sync });
    return data;
  }

}
