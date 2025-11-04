#!/usr/bin/env node
/**
 * Demo script to verify the library is working correctly
 * Tests key derivation and PSBT signing with provided test data
 */

const { generateKeys, deriveKeysFromMnemonic, signPsbt } = require('../dist/index.cjs');

// Test data from user
const testMnemonic = 'poem twice question inch happy capital grain quality laptop dry chaos what';
const expectedKeys = {
  xpub: 'tpubD6NzVbkrYhZ4XCaTDersU6277zvyyV6uCCeEgx1jfv7bUYMrbTt8Vem1MBt5Gmp7eMwjv4rB54s2kjqNNtTLYpwFsVX7H2H93pJ8SpZFRRi',
  account_xpub_vanilla: 'tpubDDMTD6EJKKLP6Gx9JUnMpjf9NYyePJszmqBnNqULNmcgEuU1yQ3JsHhWZdRFecszWETnNsmhEe9vnaNibfzZkDDHycbR2rGFbXdHWRgBfu7',
  account_xpub_colored: 'tpubDDPLJfdVbDoGtnn6hSto3oCnm6hpfHe9uk2MxcANanxk87EuquhSVfSLQv7e5UykgzaFn41DUXaikjjVGcUSUTGNaJ9LcozfRwatKp1vTfC',
  master_fingerprint: 'a66bffef',
};

// UTXO creation PSBT (unsigned)
const utxoUnsignedPsbt = 'cHNidP8BAP01AQIAAAABtSecjg4J41fmQtoh4TTlQdnu6iifN5ogbVWEAXrUWhoAAAAAAP3///8G6AMAAAAAAAAiUSDzKPGEYMWF2Spr+6GDDaiByz+OjfjlV3Lfr/zYKZ2iB+gDAAAAAAAAIlEg83490lnilgZRgrHnETy+JEjou1md47ACmb0kn5rO2+joAwAAAAAAACJRIHD6gvLQXWd4BvEW0YjxA0z50cxfC3ZUhKXnKhPTS1B+6AMAAAAAAAAiUSCXxMTRByl/+IGyzvdE6V+4ac0UOeEwe1dl3zb8ceaZ5OgDAAAAAAAAIlEg3oU2/GUMIeYj4d/R1dK5ThTLhkg7JAhjPOLjNqb215YYEzEBAAAAACJRIHn8VHdi5k8OITo7LrsqYr+cQIASgZTwvtfvYoBHBxpWoXVIAAABASsALTEBAAAAACJRIM9hxZBkyMxn4vyYOosTZEYQIMqQZRSwxigi1aTQwJLrIRaUhLceLJAwJvzah8652iBUot/I4ZG5LVNrof4L451TuRkApmv/71YAAIABAACAAAAAgAEAAAAAAAAAARcglIS3HiyQMCb82ofOudogVKLfyOGRuS1Ta6H+C+OdU7kAAQUgeHCOVR20fg1Bz+fM/Cpg3KrkSlmKQDLwInucZ2bCMcwhB3hwjlUdtH4NQc/nzPwqYNyq5EpZikAy8CJ7nGdmwjHMGQCma//vVgAAgB+fDIAAAACAAAAAAAIAAAAAAQUgzBIX4uwl2L4m53HESkMyqyevlalsmf3tw9nH0r3KQoIhB8wSF+LsJdi+JudxxEpDMqsnr5WpbJn97cPZx9K9ykKCGQCma//vVgAAgB+fDIAAAACAAAAAAAMAAAAAAQUgs43Fa7pRIMJTLGHkWwyCRf16wo3uSS/3CDv0c550QBkhB7ONxWu6USDCUyxh5FsMgkX9esKN7kkv9wg79HOedEAZGQCma//vVgAAgB+fDIAAAACAAAAAAAQAAAAAAQUgaqAn3Z3FYWYqPiTb2KCMBirkLH3ZnhE1Q7NpCOiuJBkhB2qgJ92dxWFmKj4k29igjAYq5Cx92Z4RNUOzaQjoriQZGQCma//vVgAAgB+fDIAAAACAAAAAAAEAAAAAAQUgnZNdhk/w7sXuE3/fLeNHq5My6f6IqMI5KrZAVeoZdnUhB52TXYZP8O7F7hN/3y3jR6uTMun+iKjCOSq2QFXqGXZ1GQCma//vVgAAgB+fDIAAAACAAAAAAAAAAAAAAQUg+5xo2r852/jJjwIpMPXdsWsse2hpIxAhJhP6YDPcrrIhB/ucaNq/Odv4yY8CKTD13bFrLHtoaSMQISYT+mAz3K6yGQCma//vVgAAgAEAAIAAAACAAQAAAAEAAAAA';

// UTXO creation PSBT (signed - expected result)
const utxoSignedPsbt = 'cHNidP8BAP01AQIAAAABtSecjg4J41fmQtoh4TTlQdnu6iifN5ogbVWEAXrUWhoAAAAAAP3///8G6AMAAAAAAAAiUSDzKPGEYMWF2Spr+6GDDaiByz+OjfjlV3Lfr/zYKZ2iB+gDAAAAAAAAIlEg83490lnilgZRgrHnETy+JEjou1md47ACmb0kn5rO2+joAwAAAAAAACJRIHD6gvLQXWd4BvEW0YjxA0z50cxfC3ZUhKXnKhPTS1B+6AMAAAAAAAAiUSCXxMTRByl/+IGyzvdE6V+4ac0UOeEwe1dl3zb8ceaZ5OgDAAAAAAAAIlEg3oU2/GUMIeYj4d/R1dK5ThTLhkg7JAhjPOLjNqb215YYEzEBAAAAACJRIHn8VHdi5k8OITo7LrsqYr+cQIASgZTwvtfvYoBHBxpWoXVIAAABASsALTEBAAAAACJRIM9hxZBkyMxn4vyYOosTZEYQIMqQZRSwxigi1aTQwJLrAQhCAUDrRtVkPLHRkFNKbYlEL3bgjs6wjkfkO7fZytofjY3WL7EIHD3W5I2YmVucb9aSFTGJEU2m9+9laoEebGTB8KAdAAEFIHhwjlUdtH4NQc/nzPwqYNyq5EpZikAy8CJ7nGdmwjHMAAEFIMwSF+LsJdi+JudxxEpDMqsnr5WpbJn97cPZx9K9ykKCAAEFILONxWu6USDCUyxh5FsMgkX9esKN7kkv9wg79HOedEAZAAEFIGqgJ92dxWFmKj4k29igjAYq5Cx92Z4RNUOzaQjoriQZAAEFIJ2TXYZP8O7F7hN/3y3jR6uTMun+iKjCOSq2QFXqGXZ1AAEFIPucaNq/Odv4yY8CKTD13bFrLHtoaSMQISYT+mAz3K6yAA==';

// Send begin PSBT (unsigned)
const sendUnsignedPsbt = 'cHNidP8BAIkCAAAAASs6FZbqRIdKgFpPLMi0aTfvBFqDT6JbTdDpK6P6tBhCBAAAAAD9////AgAAAAAAAAAAImog6wXBZTGshFceO1rQtCoz1eDEfgGcWdvMvHLJlmozjEKEAQAAAAAAACJRIBs/61D42aMRdH4+SEPBqOtdv4dNSIY5r8iJqACWZ5bv3XlIACb8A1JHQgH0bKC/icu0bP1eYxQ6uIpPwCU89RNB/G+yHcp4C0e3DJ0AAN1GxJO34z9oOLJIdFpzzqfl+e3voeFqTPSl45jd58mJ//////////8QJwAAAQDdRsSTt+M/aDiySHRac86n5fnt76Hhakz0peOY3efJiaAPAgABAKAPAQIAAAABAAAAaq+/lJND7LUI3gMAAAAAAAAB/GQgj9CN8+h6nKKR6li1Snudp05RyxxRBoOJ0VhYzfQICgAAAAAAAAAABvwDUkdCAgEAJvwDUkdCBN1GxJO34z9oOLJIdFpzzqfl+e3voeFqTPSl45jd58mJRN1GxJO34z9oOLJIdFpzzqfl+e3voeFqTPSl45jd58mJoA8CAPRsoL+Jy7Rs/V5jFDq4ik/AJTz1E0H8b7IdyngLR7cMAAEBK+gDAAAAAAAAIlEg3oU2/GUMIeYj4d/R1dK5ThTLhkg7JAhjPOLjNqb215YhFp2TXYZP8O7F7hN/3y3jR6uTMun+iKjCOSq2QFXqGXZ1GQCma//vVgAAgB+fDIAAAACAAAAAAAAAAAABFyCdk12GT/Duxe4Tf98t40erkzLp/oiowjkqtkBV6hl2dQAm/ANNUEMA3UbEk7fjP2g4skh0WnPOp+X57e+h4WpM9KXjmN3nyYkg/OYL9NoADeYnzQkU4TmgEJEIBWyTp0v1e1StQzxh8YYG/ANNUEMBCOSb4tcxJLMvBvwDTVBDECDrBcFlMayEVx47WtC0KjPV4MR+AZxZ28y8csmWajOMQgb8A01QQxH9PwEDAAAIAAAAAANp7skQJdswnsxrN/hH0Nzl+7GXQiel7Cq4pRCYRsvnkQAD78HzWyTQwyUtHa9FrbEEfmIcdwWoQ4MFewb7VuzpNOYAA617O8vSZCG3EdeaFfG/LLNx5vxK6Gd1mWukv9GGBr1CAANK4WCpInljss9tzwQ7WOcARnOZgXjE/5c2JsTrFZ17VwADkwf/OMoQPQy6+IHABqtMZdVjJJbK0fvFsDjEay6aqIkB3UbEk7fjP2g4skh0WnPOp+X57e+h4WpM9KXjmN3nyYn85gv02gAN5ifNCRThOaAQkQgFbJOnS/V7VK1DPGHxhgADNRqw8q4cMxyEceD9NOWnYfZBGtsLVvxmu96OG+cZgd4AA8wgXYyY/F/m1sEThgPwffAnxmAtQtAnMK9GhY82FnzLAeSb4tcxJLMvCPwFT1BSRVQBIOsFwWUxrIRXHjta0LQqM9XgxH4BnFnbzLxyyZZqM4xCAAEFIKu00zp2brpb5bM41nvP0Qkh9QiTklFIBPGRUophfkqnIQertNM6dm66W+WzONZ7z9EJIfUIk5JRSATxkVKKYX5KpxkApmv/71YAAIAfnwyAAAAAgAAAAAAGAAAAAA==';

// Send begin PSBT (signed - expected result)
const sendSignedPsbt = 'cHNidP8BAIkCAAAAASs6FZbqRIdKgFpPLMi0aTfvBFqDT6JbTdDpK6P6tBhCBAAAAAD9////AgAAAAAAAAAAImog6wXBZTGshFceO1rQtCoz1eDEfgGcWdvMvHLJlmozjEKEAQAAAAAAACJRIBs/61D42aMRdH4+SEPBqOtdv4dNSIY5r8iJqACWZ5bv3XlIACb8A1JHQgH0bKC/icu0bP1eYxQ6uIpPwCU89RNB/G+yHcp4C0e3DJ0AAN1GxJO34z9oOLJIdFpzzqfl+e3voeFqTPSl45jd58mJ//////////8QJwAAAQDdRsSTt+M/aDiySHRac86n5fnt76Hhakz0peOY3efJiaAPAgABAKAPAQIAAAABAAAAaq+/lJND7LUI3gMAAAAAAAAB/GQgj9CN8+h6nKKR6li1Snudp05RyxxRBoOJ0VhYzfQICgAAAAAAAAAABvwDUkdCAgEAJvwDUkdCBN1GxJO34z9oOLJIdFpzzqfl+e3voeFqTPSl45jd58mJRN1GxJO34z9oOLJIdFpzzqfl+e3voeFqTPSl45jd58mJoA8CAPRsoL+Jy7Rs/V5jFDq4ik/AJTz1E0H8b7IdyngLR7cMAAEBK+gDAAAAAAAAIlEg3oU2/GUMIeYj4d/R1dK5ThTLhkg7JAhjPOLjNqb215YBCEIBQD/iWL6tgZRxx3vFRbBAwQMghZhxpPw3PikeZuX527+jSiXp1ROxMGOs6OUpPyEQbCBCks3rmCczjuL6UAX2F1gAJvwDTVBDAN1GxJO34z9oOLJIdFpzzqfl+e3voeFqTPSl45jd58mJIPzmC/TaAA3mJ80JFOE5oBCRCAVsk6dL9XtUrUM8YfGGBvwDTVBDAQjkm+LXMSSzLwb8A01QQxAg6wXBZTGshFceO1rQtCoz1eDEfgGcWdvMvHLJlmozjEIG/ANNUEMR/T8BAwAACAAAAAADae7JECXbMJ7Mazf4R9Dc5fuxl0InpewquKUQmEbL55EAA+/B81sk0MMlLR2vRa2xBH5iHHcFqEODBXsG+1bs6TTmAAOtezvL0mQhtxHXmhXxvyyzceb8SuhndZlrpL/Rhga9QgADSuFgqSJ5Y7LPbc8EO1jnAEZzmYF4xP+XNibE6xWde1cAA5MH/zjKED0MuviBwAarTGXVYySWytH7xbA4xGsumqiJAd1GxJO34z9oOLJIdFpzzqfl+e3voeFqTPSl45jd58mJ/OYL9NoADeYnzQkU4TmgEJEIBWyTp0v1e1StQzxh8YYAAzUasPKuHDMchHHg/TTlp2H2QRrbC1b8ZrvejhvnGYHeAAPMIF2MmPxf5tbBE4YD8H3wJ8ZgLULQJzCvRoWPNhZ8ywHkm+LXMSSzLwj8BU9QUkVUASDrBcFlMayEVx47WtC0KjPV4MR+AZxZ28y8csmWajOMQgABBSCrtNM6dm66W+WzONZ7z9EJIfUIk5JRSATxkVKKYX5KpwA=';

async function runDemo() {
  console.log('🧪 Running RGB SDK Demo Tests\n');
  console.log('='.repeat(60));
  
  let passed = 0;
  let failed = 0;

  // Test 1: Generate new keys
  console.log('\n1️⃣ Testing generateKeys()...');
  try {
    const keys = await generateKeys('testnet');
    
    if (keys.mnemonic && keys.mnemonic.split(' ').length === 12) {
      console.log('✅ generateKeys() - Mnemonic format valid');
      passed++;
    } else {
      throw new Error('Invalid mnemonic format');
    }
    
    if (keys.account_xpub_vanilla.startsWith('tpub')) {
      console.log('✅ generateKeys() - Testnet xpub format valid');
      passed++;
    } else {
      throw new Error('Invalid testnet xpub format');
    }
    
    if (keys.master_fingerprint.match(/^[0-9a-f]{8}$/i)) {
      console.log('✅ generateKeys() - Master fingerprint format valid');
      passed++;
    } else {
      throw new Error('Invalid master fingerprint format');
    }
  } catch (error) {
    console.error('❌ generateKeys() failed:', error.message);
    failed++;
  }

  // Test 2: Derive keys from mnemonic
  console.log('\n2️⃣ Testing deriveKeysFromMnemonic()...');
  try {
    const derivedKeys = await deriveKeysFromMnemonic('testnet', testMnemonic);
    
    if (derivedKeys.xpub === expectedKeys.xpub) {
      console.log('✅ deriveKeysFromMnemonic() - Root xpub matches');
      passed++;
    } else {
      console.error('❌ Root xpub mismatch');
      console.error('   Expected:', expectedKeys.xpub);
      console.error('   Got:     ', derivedKeys.xpub);
      failed++;
    }
    
    if (derivedKeys.account_xpub_vanilla === expectedKeys.account_xpub_vanilla) {
      console.log('✅ deriveKeysFromMnemonic() - Account vanilla xpub matches');
      passed++;
    } else {
      console.error('❌ Account vanilla xpub mismatch');
      failed++;
    }
    
    if (derivedKeys.account_xpub_colored === expectedKeys.account_xpub_colored) {
      console.log('✅ deriveKeysFromMnemonic() - Account colored xpub matches');
      passed++;
    } else {
      console.error('❌ Account colored xpub mismatch');
      failed++;
    }
    
    const fingerprintLower = derivedKeys.master_fingerprint.toLowerCase();
    if (fingerprintLower === expectedKeys.master_fingerprint.toLowerCase()) {
      console.log('✅ deriveKeysFromMnemonic() - Master fingerprint matches');
      passed++;
    } else {
      console.error('❌ Master fingerprint mismatch');
      console.error('   Expected:', expectedKeys.master_fingerprint);
      console.error('   Got:     ', derivedKeys.master_fingerprint);
      failed++;
    }
  } catch (error) {
    console.error('❌ deriveKeysFromMnemonic() failed:', error.message);
    failed++;
  }

  // Test 3: Sign UTXO creation PSBT
  console.log('\n3️⃣ Testing signPsbt() with UTXO creation PSBT...');
  try {
    const signedUtxo = signPsbt(testMnemonic, utxoUnsignedPsbt, 'testnet');
    
    if (signedUtxo && signedUtxo.startsWith('cHNidP8')) {
      console.log('✅ signPsbt() - Signed PSBT format valid');
      passed++;
    } else {
      throw new Error('Invalid signed PSBT format');
    }
    
    if (signedUtxo === utxoSignedPsbt) {
      console.log('✅ signPsbt() - UTXO PSBT signature matches expected');
      passed++;
    } else {
      console.error('❌ UTXO PSBT signature mismatch');
      console.error('   Signed PSBT length:', signedUtxo.length);
      console.error('   Expected length:   ', utxoSignedPsbt.length);
      console.error('   First 100 chars:   ', signedUtxo.substring(0, 100));
      console.error('   Expected first 100:', utxoSignedPsbt.substring(0, 100));
      failed++;
    }
  } catch (error) {
    console.error('❌ signPsbt() with UTXO PSBT failed:', error.message);
    failed++;
  }

  // Test 4: Sign send PSBT
  console.log('\n4️⃣ Testing signPsbt() with send PSBT...');
  try {
    const signedSend = signPsbt(testMnemonic, sendUnsignedPsbt, 'testnet');
    
    if (signedSend && signedSend.startsWith('cHNidP8')) {
      console.log('✅ signPsbt() - Signed send PSBT format valid');
      passed++;
    } else {
      throw new Error('Invalid signed send PSBT format');
    }
    
    if (signedSend === sendSignedPsbt) {
      console.log('✅ signPsbt() - Send PSBT signature matches expected');
      passed++;
    } else {
      console.error('❌ Send PSBT signature mismatch');
      console.error('   Signed PSBT length:', signedSend.length);
      console.error('   Expected length:   ', sendSignedPsbt.length);
      failed++;
    }
  } catch (error) {
    console.error('❌ signPsbt() with send PSBT failed:', error.message);
    failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Total:  ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Library is working correctly.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please check the output above.');
    process.exit(1);
  }
}

// Run the demo
runDemo().catch((error) => {
  console.error('\n💥 Unexpected error:', error);
  process.exit(1);
});

