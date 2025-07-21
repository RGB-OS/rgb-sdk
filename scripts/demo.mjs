
// import { listUnspents, initWallet, createUtxosBegin, signPsbt, createUtxosEnd, getBtcBalance, listAssets, getAssetBalance, generateInvoice } from '../dist/index.js';
import { wallet ,createWallet} from "../dist/index.cjs";
// const keys = createWallet();
// console.log('keys', JSON.stringify(keys));
const testData = {
    "mnemonic": "input asset pistol aware deliver imitate sausage behave news category manual catch",
    "xpub": "tpubD6NzVbkrYhZ4XSMh32ufPtwNcCEXR2UPtWPKH6cr2sW4GckunPiZt3Kt1Nn8ssYPSyfaEXMHKBTgRomEe2ZiCbeevAGBBkQMmRDca8DYxhb",
    "account_xpub_vanilla": "tpubDC3SyMdeKCosZC2J2mk72m4Xp5mikH9VzTh6sVejVww3LS19HPrtLmcoyEQrbzxRcQtPQntDg5vkXuuah7QLhLKsvEvUU4B7QioM7Xc5D8K",
    "account_xpub_colored": "tpubDCW9yjx496cAwMCKSEtgnsrYgJBzZgvzzcvKsvitJTugdzF4FM3YUpKwZZ6P2L9XDhNtbHLyH7PvRN7GumcubAqyQQ3dctjaATVJaqajxa3",
    "master_fingerprint": "cf01173d"
}
wallet.init({
    mnemonic:testData.mnemonic,
    xpub_van:testData.account_xpub_vanilla,
    xpub_col:testData.account_xpub_colored,
    master_fingerprint:testData.master_fingerprint,
    network:"Regtest"
});
const signed = await wallet.signPsbt("cHNidP8BAP0KAQIAAAABsVqOKpV60NTT/5ClnR6wlouiFZp4/9ntF9haf3Df2/4CAAAAAP3///8FsSgHAAAAAAAiUSAbJMxO/lj9xgL00+bM6JU3ejGRNlOyxQgWAzEDE6zPYOgDAAAAAAAAIlEgmM03ecPNc3WH5vnjx3JF6Wv9WffcM4zlLBtVD6xv3z3oAwAAAAAAACJRIELTHjNseFJVeOSNnJALgsitE/wr187sRlo+aCslwvse6AMAAAAAAAAiUSBy647w5+m9hoW2ZSLe/WRMyH+bR1muJuvlCrt24MN7BugDAAAAAAAAIlEgGKLZ6WpEIZq1NTaBrrLotMkh/WtDErcIP/jAADOmy1hvrgUAAAEBK9o9BwAAAAAAIlEgcgZwPhCfsVHmxRm+UQUKzoYmouvuzijNsmNxTqs9J/0hFpn6m9nMYlp+H1A16sY4K66AJLQqfABR0jYc80wGMY5GGQDPARc9VgAAgAEAAIAAAACAAQAAAAAAAAABFyCZ+pvZzGJafh9QNerGOCuugCS0KnwAUdI2HPNMBjGORgABBSCQGLR2a1EH2gSTrpEEc7Zi824OGZf0GqpkdzwiCU1IniEHkBi0dmtRB9oEk66RBHO2YvNuDhmX9BqqZHc8IglNSJ4ZAM8BFz1WAACAAQAAgAAAAIABAAAAAQAAAAABBSBIl1elNuZZULkq9EoDS+4r5m0SRkQla6+Yl6bzRdW7lyEHSJdXpTbmWVC5KvRKA0vuK+ZtEkZEJWuvmJem80XVu5cZAM8BFz1WAACAH58MgAAAAIAAAAAAXAAAAAABBSBTQ1uoiVZAezlI2/5IUpvwjf/SzsJA0ijtRDRhq7Zr3CEHU0NbqIlWQHs5SNv+SFKb8I3/0s7CQNIo7UQ0Yau2a9wZAM8BFz1WAACAH58MgAAAAIAAAAAAXQAAAAABBSAjo2p8ktX7XLGURgCyAsEOwa8Zqrob6f29QHWtZeG3JyEHI6NqfJLV+1yxlEYAsgLBDsGvGaq6G+n9vUB1rWXhtycZAM8BFz1WAACAH58MgAAAAIAAAAAAWgAAAAABBSDwO/lT/KF+JEaiC78J9Bl5d+ylMO6nbvpBLcZ9ie+2LCEH8Dv5U/yhfiRGogu/CfQZeXfspTDup276QS3GfYnvtiwZAM8BFz1WAACAH58MgAAAAIAAAAAAWwAAAAA=");
console.log('signed', signed);
// const mnemonic = 'world flee sword train ready audit wedding opinion boil drift detect total'
// const mnemonic='melody fee hero onion rapid bullet again exile exact exile slogan grace'
// const asset_id ='rgb:49vaJ7XR-U7flPJB-Lb2l7cq-plK7uFu-ZEfls4!-DTECPAw'
// const init = await init(xpub);
// console.log('init', init);
// const unspents = await listUnspents('tpubD6NzVbkrYhZ4XDHNmegzuvaCFPuehC3G9Y61prY1KLoK51FWtHF65vexwE2BfbFSW23T3BKp8HBCqRJmF7Dxf6twi1R8BqC8C75X1PU8Tkc');
// console.log('listUnspends', unspents);
// wallet.init('tpubDD9Lx5UmaskH2ksixELAQ22QsVMAVWtHi3eP1QhGhr9vXpwVRfvVwxcaLDigefHNLQv5ee6muxm2Fie3HMuCaRQFPESiHUqWMcSmRzE2ecU','http://127.0.0.1:8000')
// const keys = await wallet.createWallet();
// console.log('keys', JSON.stringify(keys));
// wallet.init('tpubDCBVqdMruXVpXUzv6ADzEershYBVeKjQYkiUiYpMnz6mpEstjmByTVAChnA3LMzeLRKTPjsdNkH1sL6BwZ5w88Rj8Cn9uorsS7MJPyEZxL9','http://127.0.0.1:8000')
// const adress = await wallet.getAddress();

// const utxos_psbt = await wallet.createUtxosBegin({
//     upTo: false,
//     num: 5,
//     size: 1000,
//     feeRate: 1
// });
// console.log('utxos', utxos_psbt);
// const signedPsbt = await wallet.signPsbt({
//     psbtBase64: utxos_psbt,
//     mnemonic,
// });
// console.log('signedPsbt', signedPsbt);
// const utxosCreated = await wallet.createUtxosEnd({
//     signedPsbt: signedPsbt
// });
// console.log('utxosCreated', utxosCreated);
// const balance = await getBtcBalance(xpub);
// console.log('balance', balance);
// const assetBalance = await getAssetBalance(xpub, 'rgb:tV4HWYaf-cL194Ms-wybCrE9-1VDcchJ-lpuMv7Q-5PmlErM');
// const assetBalance = await listAssets(xpub);
// console.log('assets', assetBalance);
// wallet.init('tpubD6NzVbkrYhZ4XDHNmegzuvaCFPuehC3G9Y61prY1KLoK51FWtHF65vexwE2BfbFSW23T3BKp8HBCqRJmF7Dxf6twi1R8BqC8C75X1PU8Tkc','http://127.0.0.1:8000')
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
// console.log('------listUnspents', JSON.stringify(listUnspents));
// const invoice = await wallet.generateInvoice({amount: 100, asset_id});

// console.log('--------invoice', invoice);



// const listUnspents2 = await wallet.listUnspents();
// console.log('-------listUnspents2', JSON.stringify(listUnspents2));
// (async () => {
// const xpub = 'tpubDCNyfuS6Are75WRm61sf38RKEBbntVbMQyAuTTPAEaVFezU8yPWDreezPf38wxvcLgT3UjH5AsnegrfRniku1HWz9HN2bvCLxxgESeAUqJf'
// const mnemonic = 'melody fee hero onion rapid bullet again exile exact exile slogan grace'
// console.log('xpub', initWallet);
// console.log('xpub', signPsbt);
// console.log('xpub', listUnspends);

// const unspends = await listUnspends(xpub);
// console.log('listUnspends', unspends);

// })();
