import { RGBClient } from '../client/index';
import { FailTransfersRequest, InvoiceRequest, IssueAssetNiaRequestModel, SendAssetBeginRequestModel, SendAssetEndRequestModel } from '../types/rgb-model';
import { signPsbt } from '../crypto';
import type { Network } from '../crypto';
import { generateKeys } from '../crypto';
import { normalizeNetwork } from '../utils/network';
import { ValidationError, WalletError } from '../errors';

/**
 * Generate a new wallet with keys
 * @param network - Network string (default: 'regtest')
 * @returns Generated keys including mnemonic, xpubs, and master fingerprint
 */
export const createWallet = async (network: string | number = 'regtest') => {
  return await generateKeys(network);
}

export type WalletInitParams = {
  xpub_van: string;
  xpub_col: string;
  rgb_node_endpoint: string;
  mnemonic?: string;
  network?: string | number;
  master_fingerprint: string;
}

/**
 * Wallet Manager - High-level wallet interface combining RGB API client and cryptographic operations
 * 
 * This class provides a unified interface for:
 * - RGB Node API interactions (via RGBClient)
 * - PSBT signing operations
 * - Wallet state management
 * 
 * @example
 * ```typescript
 * const keys = await createWallet('testnet');
 * const wallet = new WalletManager({
 *   xpub_van: keys.account_xpub_vanilla,
 *   xpub_col: keys.account_xpub_colored,
 *   rgb_node_endpoint: 'http://127.0.0.1:8000',
 *   mnemonic: keys.mnemonic,
 *   network: 'testnet',
 *   master_fingerprint: keys.master_fingerprint
 * });
 * 
 * const balance = await wallet.getBtcBalance();
 * ```
 */
export class WalletManager {
  private readonly client: RGBClient;
  private readonly xpub_van: string;
  private readonly xpub_col: string;
  private readonly mnemonic: string | null;
  private readonly network: Network;
  private readonly masterFingerprint: string;

      constructor(params: WalletInitParams) {
        // Validate required parameters (skip validation for placeholder values for backward compatibility)
        const isPlaceholder = params.xpub_van === 'PLACEHOLDER' || !params.xpub_van;
        
        if (!isPlaceholder) {
          if (!params.xpub_van) {
            throw new ValidationError('xpub_van is required', 'xpub_van');
          }
          if (!params.xpub_col) {
            throw new ValidationError('xpub_col is required', 'xpub_col');
          }
          if (!params.rgb_node_endpoint) {
            throw new ValidationError('rgb_node_endpoint is required', 'rgb_node_endpoint');
          }
          if (!params.master_fingerprint) {
            throw new ValidationError('master_fingerprint is required', 'master_fingerprint');
          }
        }

        // Initialize RGB client (use minimal valid values for placeholder)
        this.client = new RGBClient({
          xpub_van: params.xpub_van || 'PLACEHOLDER',
          xpub_col: params.xpub_col || 'PLACEHOLDER',
          rgbEndpoint: params.rgb_node_endpoint || 'http://127.0.0.1:8000',
          master_fingerprint: params.master_fingerprint || '00000000',
        });

    // Store wallet state
    this.xpub_van = params.xpub_van;
    this.xpub_col = params.xpub_col;
    this.mnemonic = params.mnemonic ?? null;
    this.masterFingerprint = params.master_fingerprint;
    
    // Normalize network using utility function
    this.network = normalizeNetwork(params.network ?? 'regtest');
  }

  /**
   * Get wallet's extended public keys
   */
  public getXpub(): { xpub_van: string; xpub_col: string } {
    return { 
      xpub_van: this.xpub_van, 
      xpub_col: this.xpub_col 
    };
  }

  /**
   * Get wallet's network
   */
  public getNetwork(): Network {
    return this.network;
  }

  // ========== RGB API Methods (delegated to RGBClient) ==========

  public async registerWallet(): Promise<{ address: string; btc_balance: any }> {
    return this.client.registerWallet();
  }

  public async getBtcBalance(): Promise<any> {
    return this.client.getBtcBalance();
  }

  public async getAddress(): Promise<string> {
    return this.client.getAddress();
  }

  public async listUnspents(): Promise<any[]> {
    return this.client.listUnspents();
  }

  public async listAssets(): Promise<any> {
    return this.client.listAssets();
  }

  public async getAssetBalance(asset_id: string): Promise<any> {
    return this.client.getAssetBalance(asset_id);
  }

  public async createUtxosBegin(params: { up_to?: boolean; num?: number; size?: number; fee_rate?: number }): Promise<string> {
    return this.client.createUtxosBegin(params);
  }

  public async createUtxosEnd(params: { signed_psbt: string }): Promise<number> {
    return this.client.createUtxosEnd(params);
  }

  public async sendBegin(params: SendAssetBeginRequestModel): Promise<string> {
    return this.client.sendBegin(params);
  }

  public async sendEnd(params: SendAssetEndRequestModel): Promise<string> {
    return this.client.sendEnd(params);
  }

  public async blindReceive(params: InvoiceRequest): Promise<any> {
    return this.client.blindReceive(params);
  }

  public async witnessReceive(params: InvoiceRequest): Promise<any> {
    return this.client.witnessReceive(params);
  }

  public async issueAssetNia(params: IssueAssetNiaRequestModel): Promise<any> {
    return this.client.issueAssetNia(params);
  }

  public async refreshWallet(): Promise<void> {
    return this.client.refreshWallet();
  }

  public async listTransactions(): Promise<any> {
    return this.client.listTransactions();
  }

  public async listTransfers(asset_id: string): Promise<any[]> {
    return this.client.listTransfers(asset_id);
  }

  public async failTransfers(params: FailTransfersRequest): Promise<boolean> {
    return this.client.failTransfers(params);
  }

  public async decodeRGBInvoice(params: { invoice: string }): Promise<any> {
    return this.client.decodeRGBInvoice(params);
  }

      /**
       * Sign a PSBT using the wallet's mnemonic or a provided mnemonic
       * @param psbt - Base64 encoded PSBT
       * @param mnemonic - Optional mnemonic (uses wallet's mnemonic if not provided)
       */
      public async signPsbt(psbt: string, mnemonic?: string): Promise<string> {
        const mnemonicToUse = mnemonic ?? this.mnemonic;
        
        if (!mnemonicToUse) {
          throw new WalletError('mnemonic is required. Provide it as parameter or initialize wallet with mnemonic.');
        }

        return await signPsbt(mnemonicToUse, psbt, this.network);
      }

      /**
       * Complete send operation: begin → sign → end
       * @param invoiceTransfer - Transfer invoice parameters
       * @param mnemonic - Optional mnemonic for signing
       */
      public async send(invoiceTransfer: SendAssetBeginRequestModel, mnemonic?: string): Promise<string> {
        const psbt = await this.sendBegin(invoiceTransfer);
        const signed_psbt = await this.signPsbt(psbt, mnemonic);
        return await this.sendEnd({ signed_psbt });
      }
}

/**
 * Factory function to create a WalletManager instance
 * Provides a cleaner API than direct constructor
 * 
 * @example
 * ```typescript
 * const keys = await createWallet();
 * const wallet = createWalletManager({
 *   ...keys,
 *   rgb_node_endpoint: 'http://127.0.0.1:8000'
 * });
 * ```
 */
export function createWalletManager(params: WalletInitParams): WalletManager {
  return new WalletManager(params);
}

// Legacy singleton instance for backward compatibility
// This instance cannot be used directly - must call init() first
// @deprecated Use `new WalletManager(params)` or `createWalletManager(params)` instead
// @warning This singleton will throw if methods are called without init()
// Note: Using a getter to defer instantiation until actually used
let _wallet: WalletManager | null = null;

export const wallet = new Proxy({} as WalletManager, {
  get(target, prop) {
    if (!_wallet) {
      // Create a minimal instance for backward compatibility
      // This will only work if init() is called before using any methods
      _wallet = new WalletManager({
        xpub_van: 'PLACEHOLDER', // Will be validated when init() is called
        xpub_col: 'PLACEHOLDER',
        rgb_node_endpoint: 'http://127.0.0.1:8000',
        master_fingerprint: '00000000',
      });
    }
    const value = (_wallet as any)[prop];
    return typeof value === 'function' ? value.bind(_wallet) : value;
  },
});
