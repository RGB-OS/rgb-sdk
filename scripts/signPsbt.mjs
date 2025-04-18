import { signPsbt,initWallet } from '../dist/index.js';
(async () => {
const keys = initWallet()
console.log('keys', keys);
const signed = await signPsbt({
  mnemonic:"stereo birth depend harvest ladder industry swim suspect airport become diet coconut" ,
  psbtBase64:"cHNidP8BAP01AQIAAAABIHTH1N4apdUpce3M9AUedfC1L2hVgMB7j2iOhN9eMMgAAAAAAP3///8G6AMAAAAAAAAiUSDE/E8xGSJ6/yNrVqWyjSepKKGFSoTw1Xz6X45J8k8FaegDAAAAAAAAIlEg62h6NIkiCT8dnVl/Pn0NZw7ZfMtFa2hrJLfXBa1jPdLoAwAAAAAAACJRIIKM+EIFiAalcFu88NJrjImNjOfuVEoBIII69ahmNeAT6AMAAAAAAAAiUSDGuwlllEvVqyWstjzLfYZI6dpXC/t6wMpN1rzn6WXYXOgDAAAAAAAAIlEgCkCWun6RDmTjjIF/FmKdX57APe+Jo4zd/mZ/no8iRbGxgZgAAAAAACJRIGUhkXj/5zqG0Fd8nsGzbc0Wf2HjWpWreVJCc8awK3pZVQgAAAABASuAlpgAAAAAACJRIA8dnYdnOdou1BWtCFwNsr0wqqQuhgfYSM5fMtN3OTWnIRYeToQzxfqmfjeF9DnpJ/bNzFTbHKhGCDvbXp+3vT2CsA0AG3TM1gEAAAAAAAAAARcgHk6EM8X6pn43hfQ56Sf2zcxU2xyoRgg7216ft709grAAAQUgIgdL7pxJYorUY8YWROxZMwEWMT9i7xYEjGGCIcoVbs0hByIHS+6cSWKK1GPGFkTsWTMBFjE/Yu8WBIxhgiHKFW7NDQAbdMzWCQAAAAsAAAAAAQUgbcxYtzgTpcuG83LqsBOayMDqeO0VgBB4IBR3MpEu5IYhB23MWLc4E6XLhvNy6rATmsjA6njtFYAQeCAUdzKRLuSGDQAbdMzWCQAAAAoAAAAAAQUgbrB0IcEvba4JZdZwdqlEPbPmaiTvJZtzqkA6bgeHgwEhB26wdCHBL22uCWXWcHapRD2z5mok7yWbc6pAOm4Hh4MBDQAbdMzWCQAAAAwAAAAAAQUgeFYFHP4Rj0oUPSZGU6DJ4xklU06Q/FRLU+BMrdX7zM8hB3hWBRz+EY9KFD0mRlOgyeMZJVNOkPxUS1PgTK3V+8zPDQAbdMzWCQAAAA0AAAAAAQUgcvjukDnd7xzN8371bBhcS5WaSOSfb/xVGnppQN8Q5yohB3L47pA53e8czfN+9WwYXEuVmkjkn2/8VRp6aUDfEOcqDQAbdMzWCQAAAA4AAAAAAQUgX1oWQZ/EcMzv3X8SznH5fk1BvQfnkwrODnLfrkQj1gchB19aFkGfxHDM791/Es5x+X5NQb0H55MKzg5y365EI9YHDQAbdMzWAQAAAAEAAAAA",
});
// const signed = await signPsbt({});
console.log(signed);
})();
// (async () => {
//   const base64Psbt = await createPsbtOnDeviceA();
//   console.log('Base64 PSBT:', base64Psbt);
//   const txHex = await signPsbtOnDeviceB(base64Psbt, 'stereo birth depend harvest ladder industry swim suspect airport become diet coconut');
//   console.log('Signed Transaction Hex:', txHex);
// })();

