
// import { listUnspents, initWallet, createUtxosBegin, signPsbt, createUtxosEnd, getBtcBalance, listAssets, getAssetBalance, generateInvoice } from '../dist/index.js';
import { wallet } from "../dist/index.js";
const xpub = 'tpubDCNyfuS6Are75WRm61sf38RKEBbntVbMQyAuTTPAEaVFezU8yPWDreezPf38wxvcLgT3UjH5AsnegrfRniku1HWz9HN2bvCLxxgESeAUqJf'
const mnemonic = 'melody fee hero onion rapid bullet again exile exact exile slogan grace'

// const init = await initWallet(xpub);
// console.log('init', init);
// const unspents = await listUnspents(xpub);
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
wallet.init(xpub)
const balance = await wallet.getBtcBalance();
console.log('balance', balance);
// const invoice = await generateInvoice({xpub, amount: 1000, assetId: 'rgb:tV4HWYaf-cL194Ms-wybCrE9-1VDcchJ-lpuMv7Q-5PmlErM'});
// console.log('invoice', invoice);
// (async () => {
// const xpub = 'tpubDCNyfuS6Are75WRm61sf38RKEBbntVbMQyAuTTPAEaVFezU8yPWDreezPf38wxvcLgT3UjH5AsnegrfRniku1HWz9HN2bvCLxxgESeAUqJf'
// const mnemonic = 'melody fee hero onion rapid bullet again exile exact exile slogan grace'
// console.log('xpub', initWallet);
// console.log('xpub', signPsbt);
// console.log('xpub', listUnspends);

// const unspends = await listUnspends(xpub);
// console.log('listUnspends', unspends);

// })();
