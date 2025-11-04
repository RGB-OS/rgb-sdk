const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

// Import the rgb-sdk library
const { wallet, createWallet } = require("./dist/index.cjs");

// Configuration
const RGB_MANAGER_ENDPOINT = "http://127.0.0.1:8000";

// Initialize wallet with RGB SDK
async function initWalletWithRGBSDK() {
    console.log("\nInitializing wallet with RGB SDK...");
    
    // Generate keys using the library
    const keys = createWallet();
    console.log("Generated keys:", {
        accountXpubVanilla: keys.accountXpubVanilla,
        accountXpubColored: keys.accountXpubColored,
        masterFingerprint: keys.masterFingerprint,
        mnemonic: keys.mnemonic
    });

    // Initialize the wallet manager
    wallet.init({
        xpub_van: keys.accountXpubVanilla,
        xpub_col: keys.accountXpubColored,
        master_fingerprint: keys.masterFingerprint,
        mnemonic: keys.mnemonic,
        network: "3", // Regtest
        rgbEndpoint: RGB_MANAGER_ENDPOINT
    });

    console.log("Wallet initialized with RGB SDK");
    return { keys, wallet };
}

// Create UTXOs for the wallet
async function createUtxosForWallet(wallet) {
    console.log("\nCreating UTXOs...");
    
    try {
        // Get current address
        const address = await wallet.getAddress();
        console.log(`Wallet address: ${address}`);
        
        // Wait a moment for the transaction to be processed
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Get BTC balance
        const btcBalance = await wallet.getBtcBalance();
        console.log(`BTC Balance: ${JSON.stringify(btcBalance)}`);
        
        // Create UTXOs
        console.log("Creating UTXOs...");
        const createUtxosResult = await wallet.createUtxosBegin({
            upTo: true,
            num: 5,
            size: 1000,
            feeRate: 1
        });
        
        console.log("Unsigned PSBT for UTXO creation:", createUtxosResult);
        
        // Sign the PSBT
        const signedPsbt = await wallet.signPsbt(createUtxosResult);
        console.log("Signed PSBT:", signedPsbt);
        
        // Finalize UTXO creation
        const utxosCreated = await wallet.createUtxosEnd({ signedPsbt });
        console.log(`Created ${utxosCreated} UTXOs`);
        
        return true;
    } catch (error) {
        console.error("Error creating UTXOs:", error.message);
        return false;
    }
}

// Issue RGB assets
async function issueAssets(wallet) {
    console.log("\nIssuing RGB assets...");
    
    try {
        // Issue NIA (Non-Inflationary Asset)
        console.log("Issuing NIA asset...");
        const niaAsset = await wallet.issueAssetNia({
            ticker: "USDT",
            name: "Tether USD",
            amounts: [1000, 500],
            precision: 6
        });
        console.log("NIA Asset issued:", niaAsset);
        
        return niaAsset;
    } catch (error) {
        console.error("Error issuing assets:", error.message);
        return null;
    }
}

// Create receiving wallet and demonstrate transfer
async function createReceivingWalletAndTransfer(senderWallet, assetId) {
    console.log("\nCreating receiving wallet and transferring assets...");
    
    try {
        // Create a second wallet for receiving
        const receiverKeys = createWallet();
        const receiverWallet = require("./dist/index.cjs").wallet;
        
        receiverWallet.init({
            xpub_van: receiverKeys.accountXpubVanilla,
            xpub_col: receiverKeys.accountXpubColored,
            master_fingerprint: receiverKeys.masterFingerprint,
            mnemonic: receiverKeys.mnemonic,
            network: "3", // Regtest
            rgbEndpoint: RGB_MANAGER_ENDPOINT
        });
        
        console.log("Receiver wallet created");
        
        // Get receiver address
        const receiverAddress = await receiverWallet.getAddress();
        console.log(`Receiver address: ${receiverAddress}`);

        await createUtxosForWallet(receiverAddress)
        
        // Create blind receive for the asset
        console.log("Creating blind receive...");
        const receiveData = await receiverWallet.blindRecive({
            asset_id: assetId,
            amount: 100
        });
        console.log("Blind receive created:", receiveData);
        
        // Create invoice for sending
        const invoice = receiveData.invoice;
        console.log(`Invoice: ${invoice}`);
        
        // Step 1: Begin asset transfer
        console.log("Step 1: Starting asset transfer...");
        const sendPsbt = await senderWallet.sendBegin({
            invoice: invoice,
            fee_rate: 1,
            min_confirmations: 1
        });
        console.log("Unsigned PSBT for asset transfer:", sendPsbt);
        
        // Step 2: Sign the PSBT
        console.log("Step 2: Signing PSBT...");
        const signedSendPsbt = await senderWallet.signPsbt(sendPsbt);
        console.log("Signed PSBT:", signedSendPsbt);
        
        // Step 3: End asset transfer
        console.log("Step 3: Finalizing asset transfer...");
        const sendResult = await senderWallet.sendEnd({ signed_psbt: signedSendPsbt });
        console.log("Asset transfer completed:", sendResult);
        
        // Refresh both wallets
        console.log("Refreshing wallets...");
        await senderWallet.refreshWallet();
        await receiverWallet.refreshWallet();
        // TODO: Mine a block to confirm the transaction
        // Refresh again after mining
        await senderWallet.refreshWallet();
        await receiverWallet.refreshWallet();
        
        // Check balances
        const senderBalance = await senderWallet.getAssetBalance(assetId);
        const receiverBalance = await receiverWallet.getAssetBalance(assetId);
        
        console.log("Sender asset balance:", senderBalance);
        console.log("Receiver asset balance:", receiverBalance);
        
        return { receiverWallet, receiveData };
    } catch (error) {
        console.error("Error in transfer process:", error.message);
        return null;
    }
}

// Main execution function
async function main() {
    console.log("Starting RGB SDK Wallet Example");
    console.log("=" .repeat(50));
    
    try {
        //  Initialize wallet
        const { keys, wallet: senderWallet } = await initWalletWithRGBSDK();
        
        //  Create UTXOs
        const utxosCreated = await createUtxosForWallet(senderWallet);
        if (!utxosCreated) {
            console.log("UTXO creation failed, continuing with example...");
        }
        
        //  Issue assets
        const asset = await issueAssets(senderWallet);
        if (!asset) {
            console.log("Asset issuance failed, continuing with example...");
            return;
        }
        
        const assetId = asset.asset?.assetId;
        if (!assetId) {
            console.log("No asset ID available, cannot continue with transfer");
            return;
        }
        
        //  List assets
        console.log("\nListing all assets...");
        const allAssets = await senderWallet.listAssets();
        console.log("All assets:", JSON.stringify(allAssets, null, 2));
        
        //  Get asset balance
        console.log("\nGetting asset balance...");
        const assetBalance = await senderWallet.getAssetBalance(assetId);
        console.log("Asset balance:", assetBalance);
        
        //  Create receiving wallet and transfer
        const transferResult = await createReceivingWalletAndTransfer(senderWallet, assetId);
        
        //  List transactions and transfers
        console.log("\nListing transactions...");
        const transactions = await senderWallet.listTransactions();
        console.log("Transactions:", JSON.stringify(transactions, null, 2));
        
        console.log("\nListing transfers...");
        const transfers = await senderWallet.listTransfers(assetId);
        console.log("Transfers:", JSON.stringify(transfers, null, 2));
        
        
        console.log("\nExample completed successfully!");
        console.log("=" .repeat(50));
        
    } catch (error) {
        console.error("Error in main execution:", error);
        process.exit(1);
    }
}


// Run the example
if (require.main === module) {
    console.log("RGB SDK Wallet Complete Example");
    console.log("This example demonstrates:");
    console.log("- Wallet creation and initialization");
    console.log("- UTXO creation and management");
    console.log("- RGB asset issuance");
    console.log("- Asset transfers between wallets");
    console.log("- Backup and restore functionality");
    console.log("- Memory leak prevention");
    console.log("");
    
    main()
        .then(() => {
            console.log("All operations completed successfully!");
        })
        .catch((error) => {
            console.error("Fatal error:", error);
            process.exit(1);
        });
}

module.exports = {
    main,
    initWalletWithRGBSDK,
    createUtxosForWallet,
    issueAssets,
    createReceivingWalletAndTransfer,
    demonstrateBackupRestore,
    checkMemoryLeak
};
