const { default: axios } = require("axios");
const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
// const PROXY_BASE = 'rpc://regtest.thunderstack.org:50001'
const ELECTRUM_URL = 'tcp://regtest.thunderstack.org:50001'
const PROXY_URL = "rpc://regtest.thunderstack.org:3000/json-rpc"

const rgblib = require('rgb-lib');
async function mine(numBlocks) {
    try {
        await axios.post('http://18.119.98.232:5000/execute', {
            args:`mine ${numBlocks}`,
        });
        console.log("Mined " + numBlocks + " blocks");
    } catch (e) {
        throw new Error(`Unable to mine: ${e}`);
    }
}

async function sendToAddress(address, amt) {
    try {
        await axios.post('http://18.119.98.232:5000/execute', {
            args:`sendtoaddress ${address} ${amt}`,
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
    let bitcoinNetwork = rgblib.BitcoinNetwork.Regtest;
    // let keys = rgblib.generateKeys(bitcoinNetwork);
    // console.log("Keys: " + JSON.stringify(keys));
    let keys = {
        accountXpub: "tpubDCNyfuS6Are75WRm61sf38RKEBbntVbMQyAuTTPAEaVFezU8yPWDreezPf38wxvcLgT3UjH5AsnegrfRniku1HWz9HN2bvCLxxgESeAUqJf",
        mnemonic: "melody fee hero onion rapid bullet again exile exact exile slogan grace",
    };

    let restoredKeys = rgblib.restoreKeys(bitcoinNetwork, keys.mnemonic);
    // console.log("Restored keys: " + JSON.stringify(restoredKeys));

    let walletData = {
        dataDir: "./data",
        bitcoinNetwork: bitcoinNetwork,
        databaseType: rgblib.DatabaseType.Sqlite,
        maxAllocationsPerUtxo: "1",
        pubkey: keys.accountXpub,
        mnemonic: keys.mnemonic,
        vanillaKeychain: vanillaKeychain,
    };
    console.log("Creating wallet...");
    let wallet = new rgblib.Wallet(new rgblib.WalletData(walletData));
    console.log("Wallet created");

    let btcBalance = wallet.getBtcBalance(null, true);
    console.log("BTC balance: " + JSON.stringify(btcBalance));

    let address = wallet.getAddress();
    console.log("Address: " + address);

    // await sendToAddress(address, 1);
    // await mine(30);

    console.log("Wallet is going online...");
    let online = wallet.goOnline(false, ELECTRUM_URL);
    console.log("Wallet went online");

    btcBalance = wallet.getBtcBalance(online, false);
    console.log("BTC balance: " + JSON.stringify(btcBalance));

    // let created = wallet.createUtxos(online, false, "25", null, "1", false);
    // console.log("Created " + JSON.stringify(created) + " UTXOs");

    return [wallet, online, walletData];
}

async function  main() {
    let [wallet, online, walletData] = await initWallet(null);

    // let asset1 = wallet.issueAssetNIA(online, "USDT", "Tether", "2", [
    //     "777",
    //     "66",
    // ]);
    // console.log("Issued a NIA asset " + JSON.stringify(asset1));

    let assets1 = wallet.listAssets([
        rgblib.AssetSchema.Nia,
    ]);
    await mine(50);
    console.log("Assets: " + JSON.stringify(assets1));
    wallet.sync(online);
    // let [rcvWallet, rcvOnline, _rcvWalletData] = await initWallet(null);

    // let receiveData1 = rcvWallet.blindReceive(
    //     null,
    //     "100",
    //     null,
    //     [PROXY_URL],
    //     "1",
    // );
    // console.log("Receive data: " + JSON.stringify(receiveData1));

    // let receiveData2 = rcvWallet.witnessReceive(
    //     null,
    //     "50",
    //     "60",
    //     [PROXY_URL],
    //     "1",
    // );
    // console.log("Receive data: " + JSON.stringify(receiveData2));

    // let recipientMap = {
    //     [asset1.assetId]: [
    //         {
    //             recipientId: receiveData1.recipientId,
    //             witnessData: null,
    //             amount: "100",
    //             transportEndpoints: [PROXY_URL],
    //         },
    //     ],
    // };

    // let sendResult = wallet.send(online, recipientMap, false, "2", "1", false);
    // console.log("Sent: " + JSON.stringify(sendResult));

    // rcvWallet.refresh(rcvOnline, null, [], false);
    // wallet.refresh(online, null, [], false);

    // await mine(50);

    // rcvWallet.refresh(rcvOnline, null, [], false);
    // wallet.refresh(online, null, [], false);

    // let rcvAssets = rcvWallet.listAssets([]);
    // console.log("Assets: " + JSON.stringify(rcvAssets));

    // let rcvAssetBalance = rcvWallet.getAssetBalance(asset1.assetId);
    // console.log("Asset balance: " + JSON.stringify(rcvAssetBalance));

    // wallet.sync(online);

    // let transfers = wallet.listTransfers(asset1.assetId);
    // console.log("Transfers: " + JSON.stringify(transfers));

    // let transactions = wallet.listTransactions(online, true);
    // console.log("Transactions: " + JSON.stringify(transactions));

    // let unspents = rcvWallet.listUnspents(rcvOnline, false, false);
    // console.log("Unspents: " + JSON.stringify(unspents));

    // try {
    //     let feeEstimation = wallet.getFeeEstimation(online, "7");
    //     console.log("Fee estimation: " + JSON.stringify(feeEstimation));
    // } catch (e) {
    //     console.log("Error getting fee estimation: " + e);
    // }

    // let txid = wallet.sendBtc(
    //     online,
    //     rcvWallet.getAddress(),
    //     "700",
    //     "3",
    //     false,
    // );
    // console.log("Sent BTC, txid: " + txid);

    // // backup
    // let backupPath = "./data/backup.rgb-lib";
    // let backupPass = "password";
    // fs.unlink(backupPath, (_err) => {});
    // console.log("Performing backup...");
    // wallet.backup(backupPath, backupPass);

    // drop existing wallets and avoid memory leaks
    // console.log("Dropping wallets...");
    // rgblib.dropOnline(online);
    // wallet.drop();
    // rgblib.dropOnline(rcvOnline);
    // rcvWallet.drop();

    // // restore
    // console.log("Restoring backup...");
    // let restoreDir = "./data/restored";
    // fs.rmdir(restoreDir, (_err) => {});
    // rgblib.restoreBackup(backupPath, backupPass, restoreDir);

    // // check restored wallet
    // console.log("Instantiating restored wallet...");
    // walletData.dataDir = restoreDir;
    // wallet = new rgblib.Wallet(new rgblib.WalletData(walletData));
    // online = wallet.goOnline(false, ELECTRUM_URL);
    // assets2 = wallet.listAssets([]);
    // console.log("Assets: " + JSON.stringify(assets2));

    // // these avoid memory leaks, unnecessary here since the program exits
    // console.log("Dropping wallets...");
    rgblib.dropOnline(online);
    wallet.drop();
}

try {
    main();
} catch (e) {
    console.error("Error running example: " + e);
    process.exit(1);
}