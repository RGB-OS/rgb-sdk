
// import { listUnspents, initWallet, createUtxosBegin, signPsbt, createUtxosEnd, getBtcBalance, listAssets, getAssetBalance, generateInvoice } from '../dist/index.js';
import { wallet ,createWallet} from "../dist/index.cjs";
// const keys = createWallet();
// console.log('keys', JSON.stringify(keys));
const testData = {
    "mnemonic": "mushroom pilot innocent trouble position hard forward sudden desert throw front found",
    "xpub": "tpubD6NzVbkrYhZ4Y2xv7UUiVErqqXUFR2ztFus6mwQXRVeNfPqMfP1Q6BQSCJYXEYToXd8bJBNNv3C9TyrKsdZCCoDBPVsPBnEAwD6hXuYmpE8",
    "accountXpub": "tpubDDYnz6z5aG8k73T9Vg2Lmj5F1R4tdwPFjoBgeccJrQzDr44kgwdjqc3ghFpJu86Ksyj85aobCb1ffB6i4FrsnRSRm7RKatwdJ9HdK5zRrRZ",
    "accountXpubFingerprint": "8656bb4f",
    "psbt_unsigned": "cHNidP8BAIkBAAAAAb+fBZQizimWfi+qckn6KlcHlsMP+AT3KYyhstzRvMnoAAAAAAD+////AgAAAAAAAAAAImogBjxmpEMTh0uBU6fM6ARhtbn1NrPnaGuV+QwOwxPh3qo5AwAAAAAAACJRIAakJ2DoAdJizXmvJe5+oaK6y6QXegNWYTB55B/7J2L2uFcEACb8A1JHQgGPaJywxIlCjG1CLkXpbGHQMldpYqihboFJpAUJtq0ZX/0oAQAAk4PkVJPXcBvJRSii3FyvIgljylUyJpR6tcxS5g5d6Cr//////////xAnAAABAFmkyKmQUVr369EgdAHNMy78/SO1WEupsJT9UXhH+KFloA8BAAAAAaAPAQIAAwAAAAEAAAA9FuzTA59j4wggAAAAAAAAAIoJvUVVa6yBVHTa9YHUvfvV2qbLnv6Ck9PLheNNuC7yPXH84dIv48ey5qEVFCpmydg0ldrfI4MftLDh8TUgMwYAAAIAObkyVeNrj3KUWOOLV6CTaY/wqKGxRao7t9OlrMqQ8YYICgAAAAAAAAAcUamf2afU8ymM+zfDY6+0Qu7mxFDGME9szWcNKC13MT1x/OHSL+PHsuahFRQqZsnYNJXa3yODH7Sw4fE1IDMGAAAAAAAAJvwDUkdCAo9onLDEiUKMbUIuRelsYdAyV2liqKFugUmkBQm2rRlfAQAAAQEr6AMAAAAAAAAiUSA6UkjqydhmjJg9UqSG159DkU0NNQZOsepY8KQuYtlaLyEWN4kvZFnqBXYeW6ChPpbRyjjLOx867pWZGyqZDSisHSANAIZWu08JAAAAMQAAAAEXIDeJL2RZ6gV2HlugoT6W0co4yzsfOu6VmRsqmQ0orB0gJvwDUkdCAZOD5FST13AbyUUootxcryIJY8pVMiaUerXMUuYOXegqII9onLDEiUKMbUIuRelsYdAyV2liqKFugUmkBQm2rRlfACb8A01QQwCTg+RUk9dwG8lFKKLcXK8iCWPKVTImlHq1zFLmDl3oKiAbQCNccoaXXvXGGww5n2pKxTP+ztSmCXp7RvoaISaD+gb8A01QQwEInwYrZdYQ3i8G/ANNUEMQIAY8ZqRDE4dLgVOnzOgEYbW59Taz52hrlfkMDsMT4d6qBvwDTVBDEf0/AQMAAAgAAAAAA1W/Fu8iTh3FcdgkJIbQM84iTpqFln+kAa8fxBcxpd/ZAAP2sEDDmhwLWJmKTf6yjcrIljTvzZtAIfN2ney8nFDsbwADh6M/tVkC2SvqivPCqhJmxkGWIy4pHA3JaUE+Izo431MBk4PkVJPXcBvJRSii3FyvIgljylUyJpR6tcxS5g5d6CobQCNccoaXXvXGGww5n2pKxTP+ztSmCXp7RvoaISaD+gADqADlDf8lKwVwUGCx01UsM+2ghUQkD1PBLRjQuPFvSaoAA+aMEys59eVU2J/2PVue4d2rr3WkiIOp0kIp3O8/gdWFAAMcDZccJRQ8J+YjhjoHRZzkDNDsgZrtg1Md4whfldmcVgAD6iNR79CWUIf3QxvbqAOxU5KG4H3l3mI4JkwCvm4y9JIBnwYrZdYQ3i8I/AVPUFJFVAEgBjxmpEMTh0uBU6fM6ARhtbn1NrPnaGuV+QwOwxPh3qoAAQUgTssuncYCZ1N+rs7to5X07GYNE+Ml6Kqe9pOeimAjC1khB07LLp3GAmdTfq7O7aOV9OxmDRPjJeiqnvaTnopgIwtZDQCGVrtPCQAAAEcAAAAA"
}
wallet.init(testData.accountXpub,'https://rgb-manager.thunderstack.org',testData.mnemonic);
const signed = await wallet.signPsbt({psbtBase64:testData.psbt_unsigned});
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
