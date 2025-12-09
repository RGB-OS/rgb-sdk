import axios from 'axios';
import { WalletManager, deriveKeysFromPrivateKey, signPsbtFromPrivateKey } from './dist/index.mjs';

// Configuration
const RGB_MANAGER_ENDPOINT = "http://127.0.0.1:8000";
const BITCOIN_NODE_ENDPOINT = "http://18.119.98.232:5000/execute";

// Private Key (hex): 25c5b7223ef79dcfc71842e95bdee3ba12db87d80b013a440c2717faa8fe936a
const PRIVATE_KEY_HEX = "25c5b7223ef79dcfc71842e95bdee3ba12db87d80b013a440c2717faa8fe936a";

/**
 * Mine blocks using the Bitcoin node endpoint
 */
async function mine(numBlocks) {
    try {
        const response = await axios.post(BITCOIN_NODE_ENDPOINT, {
            args: `mine ${numBlocks}`
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(`Mined ${numBlocks} blocks`);
        return response.data;
    } catch (error) {
        throw new Error(`Unable to mine: ${error.message}`);
    }
}

/**
 * Send Bitcoin to an address using the Bitcoin node endpoint
 */
async function sendToAddress(address, amount) {
    try {
        const response = await axios.post(BITCOIN_NODE_ENDPOINT, {
            args: `sendtoaddress ${address} ${amount}`
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const txid = response.data?.result || response.data;
        console.log(`Sent ${amount} BTC to ${address}, TXID: ${txid}`);
        return txid;
    } catch (error) {
        throw new Error(`Unable to send bitcoins: ${error.message}`);
    }
}

/**
 * Initialize a wallet with RGB SDK using a hex private key
 */
async function initWalletFromPrivateKey() {
    console.log("\nInitializing wallet with RGB SDK from private key...");
    console.log("Private Key (hex):", PRIVATE_KEY_HEX);

    const bitcoinNetwork = 'regtest'; // Regtest network

    // Derive keys directly from the private key
    const keys = await deriveKeysFromPrivateKey(bitcoinNetwork, PRIVATE_KEY_HEX);
    console.log("Keys derived from private key:", {
        accountXpubVanilla: keys.account_xpub_vanilla,
        accountXpubColored: keys.account_xpub_colored,
        masterFingerprint: keys.master_fingerprint,
        xpub: keys.xpub
    });

    // Initialize wallet manager
    const wallet = new WalletManager({
        xpub_van: keys.account_xpub_vanilla,
        xpub_col: keys.account_xpub_colored,
        master_fingerprint: keys.master_fingerprint,
        // Note: We don't pass seed/mnemonic since we'll sign with signPsbtFromPrivateKey
        network: bitcoinNetwork,
        rgb_node_endpoint: RGB_MANAGER_ENDPOINT
    });

    console.log("Wallet created from private key");

    // Register wallet with RGB Node
    await wallet.registerWallet();
    console.log("Wallet registered");

    // Get BTC balance
    const btcBalance = await wallet.getBtcBalance();
    console.log("BTC balance:", JSON.stringify(btcBalance));

    // Get address
    const address = await wallet.getAddress();
    console.log("Address:", address);

    // Send some BTC to the address
    await sendToAddress(address, 1);

    // Wait a bit for the transaction to be processed
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get updated BTC balance
    const updatedBtcBalance = await wallet.getBtcBalance();
    console.log("Updated BTC balance:", JSON.stringify(updatedBtcBalance));

    // Create UTXOs
    console.log("\nCreating UTXOs...");
    const psbt = await wallet.createUtxosBegin({
        up_to: true,
        num: 5,
        size: 1000,
        fee_rate: 1
    });
    console.log("PSBT for UTXO creation:", psbt);

    // Sign PSBT using the private key directly
    console.log("\nSigning PSBT with private key...");
    const signedPsbt = await signPsbtFromPrivateKey(PRIVATE_KEY_HEX, psbt, bitcoinNetwork);
    console.log("Signed PSBT:", signedPsbt);

    // Complete UTXO creation
    const utxosCreated = await wallet.createUtxosEnd({ signed_psbt: signedPsbt });
    console.log(`Created ${utxosCreated} UTXOs`);

    return { wallet, keys };
}

/**
 * Main execution function
 */
async function main() {
    console.log("Starting RGB SDK Wallet Example with Private Key");
    console.log("=".repeat(50));

    try {
        // Initialize wallet from private key
        const { wallet, keys } = await initWalletFromPrivateKey();

        console.log("\nExample completed successfully!");
        console.log("=".repeat(50));
        console.log("\nSummary:");
        console.log("- Private Key (hex):", PRIVATE_KEY_HEX);
        console.log("- Master Fingerprint:", keys.master_fingerprint);
        console.log("- Account XPub Vanilla:", keys.account_xpub_vanilla);
        console.log("- Account XPub Colored:", keys.account_xpub_colored);
        console.log("- UTXOs created and signed with private key");

    } catch (error) {
        console.error("Error in main execution:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
        if (error.stack) {
            console.error("Stack trace:", error.stack);
        }
        process.exit(1);
    }
}

// Run the example
const isMainModule = import.meta.url === `file://${process.argv[1]}` ||
    import.meta.url.endsWith('example-privkey-flow.mjs') ||
    process.argv[1]?.endsWith('example-privkey-flow.mjs');

if (isMainModule || process.argv[1]?.includes('example-privkey-flow.mjs')) {
    console.log("RGB SDK Wallet Example with Private Key");
    console.log("This example demonstrates:");
    console.log("- Wallet creation from hex private key");
    console.log("- Key derivation from private key");
    console.log("- UTXO creation and signing with private key");
    console.log("");

    main()
        .then(() => {
            console.log("All operations completed successfully!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Fatal error:", error);
            process.exit(1);
        });
}

export {
    main,
    initWalletFromPrivateKey,
    mine,
    sendToAddress
};

