
// import { listUnspents, initWallet, createUtxosBegin, signPsbt, createUtxosEnd, getBtcBalance, listAssets, getAssetBalance, generateInvoice } from '../dist/index.js';
import { wallet, createWallet } from "../dist/index.cjs";

(async () => {
    const testData = {
       // test wallet data
    }
    let assetId = "";
    let recipientId = ''
    
    let start = Date.now();
    wallet.init({
        rgbEndpoint: 'http://127.0.0.1:8000',
        xpub_van: testData.account_xpub_vanilla,
        xpub_col: testData.account_xpub_colored,
        master_fingerprint: testData.master_fingerprint,
        network: "Mainnet",
    });
    console.log(`go_online in ${Date.now() - start} ms`);
    start = Date.now();
    await wallet.getAddress();
    console.log(`get_address in ${Date.now() - start} ms`);

    start = Date.now();
    const balance = await wallet.getBtcBalance();
    console.log(`get_btc_balance in ${Date.now() - start} ms`);
    console.log(`BTC balance: ${JSON.stringify(balance)}`);
    
  
    start = Date.now();
    await wallet.listAssets();
    console.log(`list_assets in ${Date.now() - start} ms`);

    start = Date.now();
    await wallet.getAssetBalance(assetId);
    console.log(`get_asset_balance in ${Date.now() - start} ms`);

    start = Date.now();
    await wallet.listTransfers(assetId);
    console.log(`list_transfers in ${Date.now() - start} ms`);

    start = Date.now();
    // await wallet.sendBegin({
    //     invoice: '',
    //     amount: 100000000,
    //     asset_id: assetId
    // })
    console.log(`send_begin in ${Date.now() - start} ms`);
})();
