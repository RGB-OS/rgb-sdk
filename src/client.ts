// src/index.ts
import { createClient } from "./http";
import { AssetBalanceResponse, BtcBalance, FailTransfersRequest, InvoiceReciveData, IssueAssetNIAResponse, ListAssetsResponse, RgbTransfer, Unspent } from "./types/rgb-model";

export class ThunderLink {
  private client;

  constructor({ xpub }: { xpub: string }) {
    this.client = createClient(xpub);
  }

  async registerWallet(): Promise<{ address: string, btc_balance: BtcBalance }> {
    const { data } = await this.client.post("/wallet/register");
    return data;
  }

  async getBtcBalance(): Promise<BtcBalance> {
    const { data } = await this.client.post("/wallet/btc-balance");
    return data;
  }
  async getAddress(): Promise<string> {
    const { data } = await this.client.post("/wallet/get-address");
    return data;
  }

  async listUnspents(): Promise<Unspent[]> {
    const { data } = await this.client.post("/wallet/list-unspents");
    return data;
  }

  async createUtxosBegin(params: { upTo?: boolean; num?: number; size?: number; feeRate?: number }): Promise<string> {
    const { data } = await this.client.post("/wallet/create-utxos-begin", params);
    return data;
  }

  async createUtxosEnd(params: { signedPsbt: string }): Promise<number> {
    const { data } = await this.client.post("/wallet/create-utxos-end", params);
    return data;
  }

  async blindRecive(params: { asset_id: string; amount: number }): Promise<InvoiceReciveData> {
    const { data } = await this.client.post("/blind-receive", params);
    return data;
  }

  async getAssetBalance(assetId: string):Promise<AssetBalanceResponse> {
    const { data } = await this.client.post("/wallet/get-asset-balance", { assetId });
    return data;
  }
  async issueAssetNia(params: { ticker: string; name: string, amount: number[]; precision: number; }):Promise<IssueAssetNIAResponse> {
    const { data } = await this.client.post("/wallet/issue-asset-nia", params);
    return data;
  }

  async listAssets(): Promise<ListAssetsResponse> {
    const { data } = await this.client.post("/wallet/list-assets");
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
    const { data } = await this.client.post("/wallet/list-transactions");
    return data;
  }
  async listTransfers(asset_id: string): Promise<RgbTransfer[]> {
    const { data } = await this.client.post("/wallet/list-transfers", { asset_id });
    return data;
  }
  async failTransfers(params: FailTransfersRequest): Promise<boolean> {
    const { batch_transfer_idx, no_asset_only = false, skip_sync = false } = params;
    const { data } = await this.client.post("/wallet/fail-transfers", { batch_transfer_idx, no_asset_only, skip_sync });
    return data;
  }
}
