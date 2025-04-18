import { mnemonicToSeedSync } from 'bip39';
import init, * as bdk from '../bdk-wasm/pkg/bitcoindevkit.js';
import { Wallet, Network } from '../bdk-wasm/pkg/bitcoindevkit.js';
import { ThunderLink } from './client';

const rgblib = require('rgb-lib');
const network: Network = 'regtest';

interface SignPsbtParams {
  psbtBase64: string;
  mnemonic: string;
}

export class WalletManager {
  private sdk: ThunderLink | null = null;
  private xpub: string | null = null;

  constructor() {}

  public init(xpub: string) {
    this.sdk = new ThunderLink({ xpub });
    this.xpub = xpub;
  }

  public getXpub(): string {
    if (!this.xpub) throw new Error('Wallet not initialized');
    return this.xpub;
  }

  private getSdk(): ThunderLink {
    if (!this.sdk) {
      throw new Error('Wallet not initialized. Call `wallet.init(xpub)` first.');
    }
    return this.sdk;
  }

  public async createWallet() {
    return rgblib.generateKeys(rgblib.BitcoinNetwork.Regtest);
  }

  public async getBtcBalance() {
    return await this.getSdk().getBtcBalance();
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

  public async generateInvoice(params: { assetId: string; amount: number }) {
    return await this.getSdk().generateInvoice(params);
  }

  public async issueAssetNia(params: { ticker: string; name: string; amount: number[]; precision: number }) {
    return await this.getSdk().issueAssetNia(params);
  }

  public async signPsbt({ psbtBase64, mnemonic }: SignPsbtParams) {
    const seed = mnemonicToSeedSync(mnemonic);
    const descriptors = bdk.seed_to_descriptor(seed, network, 'p2tr');
    const wallet = Wallet.create(network, descriptors.external, descriptors.internal);

    const pstb = bdk.Psbt.from_string(psbtBase64);
    const isSigned = wallet.sign(pstb);

    if (!isSigned) {
      throw new Error('Failed to sign PSBT');
    }

    return pstb.toString();
  }
}

// Singleton instance
export const wallet = new WalletManager();
