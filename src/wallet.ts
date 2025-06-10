import { ThunderLink } from './client';
import { FailTransfersRequest, IssueAssetNiaRequestModel, SendAssetBeginRequestModel, SendAssetEndRequestModel } from './types/rgb-model';
import fs from 'fs';
import path from 'path';

const rgblib = require('rgb-lib');

interface SignPsbtParams {
  psbt: string;
  mnemonic?: string;
}

export const createWallet = () => {
  return rgblib.generateKeys(rgblib.BitcoinNetwork.Regtest);
}

type InitSDKParams = {
  xpub_van: string;
  xpub_col: string;
  rgbEndpoint?: string;
  mnemonic?: string;
}

export class WalletManager {
  private sdk: ThunderLink | null = null;
  private xpub_van: string | null = null;
  private xpub_col: string | null = null;
  private mnemonic: string | null = null;

  constructor() { }

  public init({ xpub_van, xpub_col, rgbEndpoint, mnemonic }: InitSDKParams) {
    if (rgbEndpoint) {
      this.sdk = new ThunderLink({ xpub_van, xpub_col, rgbEndpoint });
    }
    this.xpub_van = xpub_van;
    this.xpub_col = xpub_col;
    this.mnemonic = mnemonic ?? null;
  }

  public getXpub(): { xpub_van: string, xpub_col: string } {
    if (!this.xpub_col || !this.xpub_van) throw new Error('Wallet not initialized');
    return { xpub_van: this.xpub_van, xpub_col: this.xpub_col };
  }

  private getSdk(): ThunderLink {
    if (!this.sdk) {
      throw new Error('Wallet not initialized. Call `wallet.init(xpub)` first.');
    }
    return this.sdk;
  }

  public async registerWallet() {
    return await this.getSdk().registerWallet();
  }

  public async getBtcBalance() {
    return await this.getSdk().getBtcBalance();
  }
  public async getAddress() {
    return await this.getSdk().getAddress();
  }

  public async listUnspents() {
    return await this.getSdk().listUnspents();
  }

  public async listAssets() {
    return await this.getSdk().listAssets();
  }

  public async getAssetBalance(assetId: string) {
    return await this.getSdk().getAssetBalance(assetId);
  }

  public async createUtxosBegin(params: { upTo?: boolean; num?: number; size?: number; feeRate?: number }) {
    return await this.getSdk().createUtxosBegin(params);
  }

  public async createUtxosEnd(params: { signedPsbt: string }) {
    return await this.getSdk().createUtxosEnd(params);
  }
  public async sendBegin(params: SendAssetBeginRequestModel) {
    return await this.getSdk().sendBegin(params);
  }
  public async sendEnd(params: SendAssetEndRequestModel) {
    return await this.getSdk().sendEnd(params);
  }

  public async send(invoiceTransfer: SendAssetBeginRequestModel, mnenonic?: string) {
    const psbt = await this.sendBegin(invoiceTransfer);
    const signedPsbt = await this.signPsbt(psbt, mnenonic);
    return await this.sendEnd({ signed_psbt: signedPsbt });
  }

  public async blindRecive(params: { asset_id: string; amount: number }) {
    return await this.getSdk().blindRecive(params);
  }

  public async issueAssetNia(params: IssueAssetNiaRequestModel) {
    return await this.getSdk().issueAssetNia(params);
  }

  public async signPsbt(psbt: string, mnemonic?: string): Promise<string> {

    // Resolve the data directory path
    const projectRoot = path.resolve(__dirname, '..');  // adjust as needed

    const dataDir = path.join(projectRoot, 'data');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    console.log('Data directory:', dataDir);

    let walletData = {
      dataDir: dataDir,
      bitcoinNetwork: rgblib.BitcoinNetwork.Regtest,
      databaseType: rgblib.DatabaseType.Sqlite,
      maxAllocationsPerUtxo: "1",
      accountXpubVanilla: this.xpub_van,
      accountXpubColored: this.xpub_col,
      mnemonic: mnemonic ?? this.mnemonic,
      vanillaKeychain: "1",
    };
    let rgbWallet = new rgblib.Wallet(new rgblib.WalletData(walletData));
    const signed = rgbWallet.signPsbt(psbt)
    return signed;
  }
  public async refreshWallet() {
    return await this.getSdk().refreshWallet();
  }
  public async listTransactions() {
    return await this.getSdk().listTransactions();
  }
  public async listTransfers(asset_id: string) {
    return await this.getSdk().listTransfers(asset_id);
  }
  public async failTransfers(params: FailTransfersRequest) {
    return await this.getSdk().failTransfers(params);
  }
  public async decodeRGBInvoice(params: { invoice: string }) {
    return await this.getSdk().decodeRGBInvoice(params);
  }
}

// Singleton instance
export const wallet = new WalletManager();
