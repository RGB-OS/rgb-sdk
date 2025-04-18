// src/index.ts
import { createClient } from "./http";

export class ThunderLink {
  private client;

  constructor({ xpub }: { xpub: string }) {
    this.client = createClient(xpub);
  }

  async getBtcBalance() {
    const { data } = await this.client.post("/wallet/btc-balance");
    return data;
  }

  async listUnspents() {
    const { data } = await this.client.post("/wallet/list-unspents");
    return data;
  }

  async createUtxosBegin(params: { upTo?: boolean; num?: number; size?: number; feeRate?: number }) {
    const { data } = await this.client.post("/wallet/create-utxos-begin", params);
    return data;
  }

  async createUtxosEnd(params: { signedPsbt: string }) {
    const { data } = await this.client.post("/wallet/create-utxos-end", params);
    return data;
  }

  async generateInvoice(params: { assetId: string; amount: number }) {
    const { data } = await this.client.post("/blind-receive", params);
    return data;
  }

  async getAssetBalance(assetId: string) {
    const { data } = await this.client.post("/wallet/get-asset-balance", { assetId });
    return data;
  }
  async issueAssetNia(params: { ticker: string; name: string, amount: number[]; precision: number; }) {
    const { data } = await this.client.post("/wallet/issue-asset-nia", params);
    return data;
  }

  async listAssets() {
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
}
