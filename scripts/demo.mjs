
// import { listUnspents, initWallet, createUtxosBegin, signPsbt, createUtxosEnd, getBtcBalance, listAssets, getAssetBalance, generateInvoice } from '../dist/index.js';
import { wallet } from "../dist/index.cjs";
// const xpub = 'tpubDCNyfuS6Are75WRm61sf38RKEBbntVbMQyAuTTPAEaVFezU8yPWDreezPf38wxvcLgT3UjH5AsnegrfRniku1HWz9HN2bvCLxxgESeAUqJf'
const mnemonic = 'melody fee hero onion rapid bullet again exile exact exile slogan grace'
const asset_id ='rgb:49vaJ7XR-U7flPJB-Lb2l7cq-plK7uFu-ZEfls4!-DTECPAw'
// const init = await initWallet(xpub);
// console.log('init', init);
// const unspents = await listUnspents('tpubD6NzVbkrYhZ4XDHNmegzuvaCFPuehC3G9Y61prY1KLoK51FWtHF65vexwE2BfbFSW23T3BKp8HBCqRJmF7Dxf6twi1R8BqC8C75X1PU8Tkc');
// console.log('listUnspends', unspents);


// const utxos_psbt = await createUtxosBegin({
//     xpub,
//     upTo: false,
//     num: 5,
//     size: 1000,
//     feeRate: 1
// });
// console.log('utxos', utxos_psbt);
// const signedPsbt = await signPsbt({
//     psbtBase64: utxos_psbt.psbt,
//     mnemonic,
// });
// console.log('signedPsbt', signedPsbt);
// const utxosCreated = await createUtxosEnd({
//     signedPsbt: signedPsbt,
//     xpub,
// });
// console.log('utxosCreated', utxosCreated);
// const balance = await getBtcBalance(xpub);
// console.log('balance', balance);
// const assetBalance = await getAssetBalance(xpub, 'rgb:tV4HWYaf-cL194Ms-wybCrE9-1VDcchJ-lpuMv7Q-5PmlErM');
// const assetBalance = await listAssets(xpub);
// console.log('assets', assetBalance);
wallet.init('tpubD6NzVbkrYhZ4XDHNmegzuvaCFPuehC3G9Y61prY1KLoK51FWtHF65vexwE2BfbFSW23T3BKp8HBCqRJmF7Dxf6twi1R8BqC8C75X1PU8Tkc','http://127.0.0.1:8000')
// const assetBalance = await wallet.listAssets();
// console.log('assets', JSON.stringify(assetBalance));
// const balance = await wallet.getBtcBalance();
// console.log('balance', balance);
// const listTransactions = await wallet.listTransfers(asset_id);
// console.log('listTransactions', listTransactions);
// const refresh = await wallet.refreshWallet();
// console.log('refresh', refresh);

// const keys = await wallet.createWallet();
// console.log(JSON.stringify(keys))

// const listTransactionsafter = await wallet.listAssets();
// console.log('------listTransactionsafter', JSON.stringify(listTransactionsafter));
// const listUnspents = await wallet.listUnspents();
// console.log('------listUnspents', JSON.stringify(listUnspents.unspents));
// const invoice = await wallet.generateInvoice({amount: 100, asset_id});

// console.log('--------invoice', invoice);



const listUnspents2 = await wallet.listUnspents();
console.log('-------listUnspents2', JSON.stringify(listUnspents2));
// (async () => {
// const xpub = 'tpubDCNyfuS6Are75WRm61sf38RKEBbntVbMQyAuTTPAEaVFezU8yPWDreezPf38wxvcLgT3UjH5AsnegrfRniku1HWz9HN2bvCLxxgESeAUqJf'
// const mnemonic = 'melody fee hero onion rapid bullet again exile exact exile slogan grace'
// console.log('xpub', initWallet);
// console.log('xpub', signPsbt);
// console.log('xpub', listUnspends);

// const unspends = await listUnspends(xpub);
// console.log('listUnspends', unspends);

// })();
