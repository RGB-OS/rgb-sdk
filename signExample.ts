import { mnemonicToSeedSync } from 'bip39';
import init, * as bdk from '../bundles/wasm/bitcoindevkit.js';
import { Wallet, Network, KeychainKind } from '../bundles/wasm/bitcoindevkit.js';

const network: Network = 'regtest';
const testData = {
    "mnemonic": "mushroom pilot innocent trouble position hard forward sudden desert throw front found",
    "xpub": "tpubD6NzVbkrYhZ4Y2xv7UUiVErqqXUFR2ztFus6mwQXRVeNfPqMfP1Q6BQSCJYXEYToXd8bJBNNv3C9TyrKsdZCCoDBPVsPBnEAwD6hXuYmpE8",
    "accountXpub": "tpubDDYnz6z5aG8k73T9Vg2Lmj5F1R4tdwPFjoBgeccJrQzDr44kgwdjqc3ghFpJu86Ksyj85aobCb1ffB6i4FrsnRSRm7RKatwdJ9HdK5zRrRZ",
    "accountXpubFingerprint": "8656bb4f",
    "psbt_unsigned": "cHNidP8BAIkBAAAAAb+fBZQizimWfi+qckn6KlcHlsMP+AT3KYyhstzRvMnoAAAAAAD+////AgAAAAAAAAAAImogAg1lJfZRDcP1rlhYyEDwWYqBvAlCpdHD3Vieay+kBOU5AwAAAAAAACJRIKS8lVO9TcaxrAaKRBK9yzBWTT8yd9NlOTXOFWVrvO3xUFcEACb8A1JHQgGc4y1uijTvyWe0wUqROAKWirYScI0r1Nw5/vDaQ+Xc2f0oAQAAk4PkVJPXcBvJRSii3FyvIgljylUyJpR6tcxS5g5d6Cr//////////xAnAAABAFmkyKmQUVr369EgdAHNMy78/SO1WEupsJT9UXhH+KFloA8BAAAAAaAPAQIAAwAAAAEAAABc/dWo+xTVRwggAAAAAAAAAAyWtEpcYYjMWGlnsrZkh7DqGfLXb/3K/iFCOFh0Orb1PXH84dIv48ey5qEVFCpmydg0ldrfI4MftLDh8TUgMwYAAAIAObkyVeNrj3KUWOOLV6CTaY/wqKGxRao7t9OlrMqQ8YYICgAAAAAAAACZxLKa0rH4qCWYbnqO0+X/Lq+auH/G5+UfVrSYAarvLj1x/OHSL+PHsuahFRQqZsnYNJXa3yODH7Sw4fE1IDMGAAAAAAAAJvwDUkdCApzjLW6KNO/JZ7TBSpE4ApaKthJwjSvU3Dn+8NpD5dzZAQAAAQEr6AMAAAAAAAAiUSA6UkjqydhmjJg9UqSG159DkU0NNQZOsepY8KQuYtlaLyEWN4kvZFnqBXYeW6ChPpbRyjjLOx867pWZGyqZDSisHSANAIZWu08JAAAAMQAAAAEXIDeJL2RZ6gV2HlugoT6W0co4yzsfOu6VmRsqmQ0orB0gJvwDUkdCAZOD5FST13AbyUUootxcryIJY8pVMiaUerXMUuYOXegqIJzjLW6KNO/JZ7TBSpE4ApaKthJwjSvU3Dn+8NpD5dzZACb8A01QQwCTg+RUk9dwG8lFKKLcXK8iCWPKVTImlHq1zFLmDl3oKiBGr15kuQi5KG75R9xUHyAcOseIn2ggAqdrKD3a962xYAb8A01QQwEI2xDUizoCQ4oG/ANNUEMQIAINZSX2UQ3D9a5YWMhA8FmKgbwJQqXRw91YnmsvpATlBvwDTVBDEf0/AQMAAAgAAAAAA/rklqJECIDwufxxGzEREWasxEpc0zQcepQpu5pRj6KgAAPOFWXpoNlM/Zddm9YNNT/UpmR5MbZbIrxQLFF94RuVeQAD5Tv33U58c1QtuTAZmuVAeY0iY0Z7300/h+s590MxmwgBk4PkVJPXcBvJRSii3FyvIgljylUyJpR6tcxS5g5d6CpGr15kuQi5KG75R9xUHyAcOseIn2ggAqdrKD3a962xYAADejpdLgpaEpZG+s7tQhzB7TYFR4Nr3GUDgxei66+iPCcAA5t8ODtOj6JK4QIbqbYwQomv53I15Rs1IUblcT0R7thlAAPGycEUgJFqEN4ImdcdTQs+MmyDKkBto/8qOxMi69FBwwAD70laEyD3xMfm4Q+82qT2L7x079av6i1Xhm3CbQ8S17cB2xDUizoCQ4oI/AVPUFJFVAEgAg1lJfZRDcP1rlhYyEDwWYqBvAlCpdHD3Vieay+kBOUAAQUgnOSUpyeshi66c4S6S76AXQVBtSgsT/Fk6L/U7Da/QMwhB5zklKcnrIYuunOEuku+gF0FQbUoLE/xZOi/1Ow2v0DMDQCGVrtPCQAAAD8AAAAA"
}

interface SignPsbtParams {
    psbt_unsigned: string;
    mnemonic: string;
}

const signPsbt = ({ psbt_unsigned, mnemonic }: SignPsbtParams) => {

    const seed = mnemonicToSeedSync(mnemonic);
    const descriptors = bdk.seed_to_descriptor(seed, network, 'p2tr');
    const wallet = Wallet.create(network, descriptors.external, descriptors.internal);

    const pstb = bdk.Psbt.from_string(psbt_unsigned);

    const isSigned = wallet.sign(pstb);
    if (!isSigned) {
        throw new Error('Failed to sign PSBT');
    }

    return pstb.toString();
}

// signPsbt({mnemonic: testData.mnemonic, psbt_unsigned: testData.psbt_unsigned})