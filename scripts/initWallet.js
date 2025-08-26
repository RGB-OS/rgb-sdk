const { default: axios } = require("axios");
// import { AssetSchema, FailTransfersRequest, IssueAssetNiaRequestModel, SendAssetBeginRequestModel, SendAssetEndRequestModel } from './types/rgb-model';
const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const { performance } = require("perf_hooks");
async function measureListTransfersParallel(wallet, assetId) {
    const startTotal = performance.now();

    // Start all 3 calls in parallel
    const startTimes = [performance.now(), performance.now(), performance.now()];
    const promises = [
        (async () => {
            const res = wallet.listTransfers(assetId);
            console.log(`Call 1 done in ${(performance.now() - startTimes[0]).toFixed(2)} ms`);
            return res;
        })(),
        (async () => {
            const res = wallet.listTransfers(assetId);
            console.log(`Call 2 done in ${(performance.now() - startTimes[1]).toFixed(2)} ms`);
            return res;
        })(),
        (async () => {
            const res = wallet.listTransfers(assetId);
            console.log(`Call 3 done in ${(performance.now() - startTimes[2]).toFixed(2)} ms`);
            return res;
        })()
    ];

    const results = await Promise.all(promises);

    console.log(`All 3 calls completed in ${(performance.now() - startTotal).toFixed(2)} ms`);
    return results;
}

// const PROXY_BASE = 'rpc://regtest.thunderstack.org:50001'
const ELECTRUM_URL = 'ssl://electrum.iriswallet.com:50003'
const PROXY_URL = "rpcs://proxy.iriswallet.com/0.2/json-rpc"

const rgblib = require('rgb-lib');
async function mine(numBlocks) {
    try {
        await axios.post('http://18.119.98.232:5000/execute', {
            args: `mine ${numBlocks}`,
        });
        console.log("Mined " + numBlocks + " blocks");
    } catch (e) {
        throw new Error(`Unable to mine: ${e}`);
    }
}

async function sendToAddress(address, amt) {
    try {
        await axios.post('http://18.119.98.232:5000/execute', {
            args: `sendtoaddress ${address} ${amt}`,
        });
        console.log("Sent, TXID: ");
    } catch (e) {
        throw new Error(`Unable to send bitcoins: ${e}`);
    }
}

/* Run this method and monitor memory usage to check there are no memory leaks */
function checkMemoryLeak() {
    for (let i = 0; i < 50; i++) {
        let [wallet, online] = initWallet();
        rgblib.dropOnline(online);
        wallet.drop();
    }
}

async function initWallet(vanillaKeychain) {
    // let bitcoinNetwork = rgblib.BitcoinNetwork.Regtest;
    let bitcoinNetwork = rgblib.BitcoinNetwork.Mainnet;
    // let keys = rgblib.generateKeys(bitcoinNetwork);
    // console.log("Keys: " + JSON.stringify(keys));

    let restoreDir = "./data/restored";
    // backup

    // fs.rmdir(restoreDir, (_err) => { });
    // rgblib.restoreBackup(backupPath, backupPass, restoreDir);

    // let restoredKeys = rgblib.restoreKeys(bitcoinNetwork, keys.mnemonic);
    // console.log("Restored keys: " + JSON.stringify(restoredKeys));
  
    let walletData = {
        dataDir: restoreDir,
        bitcoinNetwork: bitcoinNetwork,
        databaseType: rgblib.DatabaseType.Sqlite,
        maxAllocationsPerUtxo: "1",
        accountXpubVanilla: keys.account_xpub_vanilla,
        accountXpubColored: keys.account_xpub_colored,
        mnemonic: null,
        masterFingerprint: keys.master_fingerprint,
        supportedSchemas: [
            rgblib.AssetSchema.Cfa,
            rgblib.AssetSchema.Nia,
            rgblib.AssetSchema.Uda,
        ],
        vanillaKeychain: "1",
    };

    console.log("Creating wallet...");
    let start = Date.now();
    let wallet = new rgblib.Wallet(new rgblib.WalletData(walletData));
    console.log(`Wallet created in ${Date.now() - start} ms`);

    start = Date.now();
    let address = wallet.getAddress();
    console.log(`Address fetched in ${Date.now() - start} ms: ${address}`);

    console.log("Wallet is going online...");
    start = Date.now();

    let online = wallet.goOnline(false, ELECTRUM_URL);
    console.log(`Wallet went online in ${Date.now() - start} ms`);

    start = Date.now();
    btcBalance = wallet.getBtcBalance(online, false);
    console.log(`BTC balance fetched in ${Date.now() - start} ms: ${JSON.stringify(btcBalance)}`);

    // let created = wallet.createUtxos(online, false, "25", null, "1", false);
    // console.log("Created " + JSON.stringify(created) + " UTXOs");
    wallet.sync(online);
    return [wallet, online, walletData];
}

async function main() {
    let [wallet, online, walletData] = await initWallet(null);
    let assetId = "";
    let recipientId = ''
    start = Date.now();
    let assets = wallet.listAssets([
        rgblib.AssetSchema.Nia,
    ]);
    // console.log(`list assets : ${JSON.stringify(assets)}`);
    console.log(`listAssets in ${Date.now() - start} ms`);


    let receiveData2 = wallet.witnessReceive(
        null,
        '{"Fungible":50}',
        "60",
        [PROXY_URL],
        "1",
    );
    let recipientMap = {
        [asset2.assetId]: [
            {
                recipientId: receiveData2.recipientId,
                witnessData: {
                    amountSat: "1500",
                    blinding: null,
                },
                assignment: { Fungible: 50 },
                transportEndpoints: [PROXY_URL],
            },
        ],
    };

    // let sendResult = wallet.sendbe(online, recipientMap, false, "2", "1", false);

    start = Date.now();
    let transfers1 = wallet.listTransfers(assetId);
    console.log(`single listTransfers for ${assetId} in ${Date.now() - start} ms`);
    console.log(`single listTransfers for ${assetId} in ${Date.now() - start} ms`);
    const transfers = await measureListTransfersParallel(wallet, assetId);
    // console.log(`Transfers for asset ${assetId}: ${JSON.stringify(transfers)}`);
    console.log(`listTransfers for ${assetId} in ${Date.now() - start} ms`);
   
    console.log("Dropping wallets...");
    rgblib.dropOnline(online);
    wallet.drop();
}

try {
    main();
} catch (e) {
    console.error("Error running example: " + e);
    process.exit(1);
}