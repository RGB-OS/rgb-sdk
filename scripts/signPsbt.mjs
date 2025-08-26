import { signPsbt,initWallet } from '../dist/index.js';
(async () => {
const keys = initWallet()
console.log('keys', keys);

const signed = await signPsbt({});
console.log(signed);
})();


