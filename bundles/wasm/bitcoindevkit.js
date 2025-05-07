
let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextEncoder, TextDecoder } = require(`util`);

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export_2(addHeapObject(e));
    }
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getDataViewMemory0();
    for (let i = 0; i < array.length; i++) {
        mem.setUint32(ptr + 4 * i, addHeapObject(array[i]), true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(takeObject(mem.getUint32(i, true)));
    }
    return result;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
 * @param {Uint8Array} seed
 * @param {Network} network
 * @param {AddressType} address_type
 * @returns {DescriptorPair}
 */
module.exports.seed_to_descriptor = function(seed, network, address_type) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(seed, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        wasm.seed_to_descriptor(retptr, ptr0, len0, (__wbindgen_enum_Network.indexOf(network) + 1 || 6) - 1, (__wbindgen_enum_AddressType.indexOf(address_type) + 1 || 6) - 1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return DescriptorPair.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * @param {string} extended_privkey
 * @param {string} fingerprint
 * @param {Network} network
 * @param {AddressType} address_type
 * @returns {DescriptorPair}
 */
module.exports.xpriv_to_descriptor = function(extended_privkey, fingerprint, network, address_type) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(extended_privkey, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(fingerprint, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        wasm.xpriv_to_descriptor(retptr, ptr0, len0, ptr1, len1, (__wbindgen_enum_Network.indexOf(network) + 1 || 6) - 1, (__wbindgen_enum_AddressType.indexOf(address_type) + 1 || 6) - 1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return DescriptorPair.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * @param {string} extended_pubkey
 * @param {string} fingerprint
 * @param {Network} network
 * @param {AddressType} address_type
 * @returns {DescriptorPair}
 */
module.exports.xpub_to_descriptor = function(extended_pubkey, fingerprint, network, address_type) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(extended_pubkey, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(fingerprint, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        wasm.xpub_to_descriptor(retptr, ptr0, len0, ptr1, len1, (__wbindgen_enum_Network.indexOf(network) + 1 || 6) - 1, (__wbindgen_enum_AddressType.indexOf(address_type) + 1 || 6) - 1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return DescriptorPair.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
 * @param {Uint8Array} seed
 * @param {Network} network
 * @returns {string}
 */
module.exports.seed_to_xpriv = function(seed, network) {
    let deferred3_0;
    let deferred3_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(seed, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        wasm.seed_to_xpriv(retptr, ptr0, len0, (__wbindgen_enum_Network.indexOf(network) + 1 || 6) - 1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr2 = r0;
        var len2 = r1;
        if (r3) {
            ptr2 = 0; len2 = 0;
            throw takeObject(r2);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export_3(deferred3_0, deferred3_1, 1);
    }
};

/**
 * @param {any} slip10
 * @param {Network} network
 * @returns {string}
 */
module.exports.slip10_to_extended = function(slip10, network) {
    let deferred2_0;
    let deferred2_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.slip10_to_extended(retptr, addHeapObject(slip10), (__wbindgen_enum_Network.indexOf(network) + 1 || 6) - 1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
            ptr1 = 0; len1 = 0;
            throw takeObject(r2);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
    }
};

const __wbindgen_enum_AddressType = ["p2pkh", "p2sh", "p2wpkh", "p2wsh", "p2tr"];

const __wbindgen_enum_Denomination = ["BTC", "cBTC", "mBTC", "uBTC", "nBTC", "pBTC", "bits", "satoshi", "msat"];

const __wbindgen_enum_KeychainKind = ["external", "internal"];

const __wbindgen_enum_Network = ["bitcoin", "testnet", "testnet4", "signet", "regtest"];

const AddressFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_address_free(ptr >>> 0, 1));
/**
 * A Bitcoin address.
 */
class Address {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Address.prototype);
        obj.__wbg_ptr = ptr;
        AddressFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AddressFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_address_free(ptr, 0);
    }
    /**
     * @param {string} address_str
     * @param {Network} network
     * @returns {Address}
     */
    static from_string(address_str, network) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(address_str, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.address_from_string(retptr, ptr0, len0, (__wbindgen_enum_Network.indexOf(network) + 1 || 6) - 1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Constructs an [`Address`] from an output script (`scriptPubkey`).
     * @param {ScriptBuf} script_buf
     * @param {Network} network
     * @returns {Address}
     */
    static from_script(script_buf, network) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(script_buf, ScriptBuf);
            var ptr0 = script_buf.__destroy_into_raw();
            wasm.address_from_script(retptr, ptr0, (__wbindgen_enum_Network.indexOf(network) + 1 || 6) - 1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.Address = Address;

const AddressInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_addressinfo_free(ptr >>> 0, 1));
/**
 * A derived address and the index it was found at.
 */
class AddressInfo {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AddressInfo.prototype);
        obj.__wbg_ptr = ptr;
        AddressInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AddressInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_addressinfo_free(ptr, 0);
    }
    /**
     * Child index of this address
     * @returns {number}
     */
    get index() {
        const ret = wasm.addressinfo_index(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Address
     * @returns {Address}
     */
    get address() {
        const ret = wasm.addressinfo_address(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * Type of keychain
     * @returns {KeychainKind}
     */
    get keychain() {
        const ret = wasm.addressinfo_keychain(this.__wbg_ptr);
        return __wbindgen_enum_KeychainKind[ret];
    }
    /**
     * Gets the address type of the address.
     *
     * # Returns
     *
     * None if unknown, non-standard or related to the future witness version.
     * @returns {AddressType | undefined}
     */
    get address_type() {
        const ret = wasm.addressinfo_address_type(this.__wbg_ptr);
        return __wbindgen_enum_AddressType[ret];
    }
}
module.exports.AddressInfo = AddressInfo;

const AmountFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_amount_free(ptr >>> 0, 1));
/**
 * Amount
 *
 * The [Amount] type can be used to express Bitcoin amounts that support
 * arithmetic and conversion to various denominations.
 */
class Amount {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Amount.prototype);
        obj.__wbg_ptr = ptr;
        AmountFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AmountFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_amount_free(ptr, 0);
    }
    /**
     * @param {number} btc
     * @returns {Amount}
     */
    static from_btc(btc) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.amount_from_btc(retptr, btc);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Amount.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {bigint} satoshi
     * @returns {Amount}
     */
    static from_sat(satoshi) {
        const ret = wasm.amount_from_sat(satoshi);
        return Amount.__wrap(ret);
    }
    /**
     * Gets the number of satoshis in this [`Amount`].
     * @returns {bigint}
     */
    to_sat() {
        const ret = wasm.amount_to_sat(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Express this [`Amount`] as a floating-point value in Bitcoin.
     *
     * Please be aware of the risk of using floating-point numbers.
     * @returns {number}
     */
    to_btc() {
        const ret = wasm.amount_to_btc(this.__wbg_ptr);
        return ret;
    }
    /**
     * Express this [Amount] as a floating-point value in the given denomination.
     *
     * Please be aware of the risk of using floating-point numbers.
     * @param {Denomination} denom
     * @returns {number}
     */
    to_float_in(denom) {
        const ret = wasm.amount_to_float_in(this.__wbg_ptr, (__wbindgen_enum_Denomination.indexOf(denom) + 1 || 10) - 1);
        return ret;
    }
}
module.exports.Amount = Amount;

const BalanceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_balance_free(ptr >>> 0, 1));
/**
 * Balance, differentiated into various categories.
 */
class Balance {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Balance.prototype);
        obj.__wbg_ptr = ptr;
        BalanceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BalanceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_balance_free(ptr, 0);
    }
    /**
     * All coinbase outputs not yet matured
     * @returns {Amount}
     */
    get immature() {
        const ret = wasm.balance_immature(this.__wbg_ptr);
        return Amount.__wrap(ret);
    }
    /**
     * Unconfirmed UTXOs generated by a wallet tx
     * @returns {Amount}
     */
    get trusted_pending() {
        const ret = wasm.balance_trusted_pending(this.__wbg_ptr);
        return Amount.__wrap(ret);
    }
    /**
     * Unconfirmed UTXOs received from an external wallet
     * @returns {Amount}
     */
    get untrusted_pending() {
        const ret = wasm.balance_untrusted_pending(this.__wbg_ptr);
        return Amount.__wrap(ret);
    }
    /**
     * Confirmed and immediately spendable balance
     * @returns {Amount}
     */
    get confirmed() {
        const ret = wasm.balance_confirmed(this.__wbg_ptr);
        return Amount.__wrap(ret);
    }
    /**
     * Get sum of trusted_pending and confirmed coins.
     *
     * This is the balance you can spend right now that shouldn't get cancelled via another party
     * double spending it.
     * @returns {Amount}
     */
    get trusted_spendable() {
        const ret = wasm.balance_trusted_spendable(this.__wbg_ptr);
        return Amount.__wrap(ret);
    }
    /**
     * Get the whole balance visible to the wallet.
     * @returns {Amount}
     */
    get total() {
        const ret = wasm.balance_total(this.__wbg_ptr);
        return Amount.__wrap(ret);
    }
}
module.exports.Balance = Balance;

const BlockIdFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_blockid_free(ptr >>> 0, 1));
/**
 * A reference to a block in the canonical chain.
 */
class BlockId {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BlockId.prototype);
        obj.__wbg_ptr = ptr;
        BlockIdFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BlockIdFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_blockid_free(ptr, 0);
    }
    /**
     * The height of the block.
     * @returns {number}
     */
    get height() {
        const ret = wasm.blockid_height(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * The hash of the block.
     * @returns {string}
     */
    get hash() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.blockid_hash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.BlockId = BlockId;

const ChainPositionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_chainposition_free(ptr >>> 0, 1));
/**
 * Represents the observed position of some chain data.
 */
class ChainPosition {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ChainPosition.prototype);
        obj.__wbg_ptr = ptr;
        ChainPositionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ChainPositionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_chainposition_free(ptr, 0);
    }
    /**
     * Returns whether [`ChainPosition`] is confirmed or not.
     * @returns {boolean}
     */
    get is_confirmed() {
        const ret = wasm.chainposition_is_confirmed(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Determines the upper bound of the confirmation height.
     * @returns {number | undefined}
     */
    get confirmation_height_upper_bound() {
        const ret = wasm.chainposition_confirmation_height_upper_bound(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * When the chain data is last seen in the mempool.
     *
     * This value will be `None` if the chain data was never seen in the mempool and only seen
     * in a conflicting chain.
     * @returns {bigint | undefined}
     */
    get last_seen() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chainposition_last_seen(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * The [`Anchor`].
     * @returns {ConfirmationBlockTime | undefined}
     */
    get anchor() {
        const ret = wasm.chainposition_anchor(this.__wbg_ptr);
        return ret === 0 ? undefined : ConfirmationBlockTime.__wrap(ret);
    }
    /**
     * Whether the chain data is anchored transitively by a child transaction.
     *
     * If the value is `Some`, it means we have incomplete data. We can only deduce that the
     * chain data is confirmed at a block equal to or lower than the block referenced by `A`.
     * @returns {Txid | undefined}
     */
    get transitively() {
        const ret = wasm.chainposition_transitively(this.__wbg_ptr);
        return ret === 0 ? undefined : Txid.__wrap(ret);
    }
}
module.exports.ChainPosition = ChainPosition;

const ChangeSetFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_changeset_free(ptr >>> 0, 1));
/**
 * A changeset for [`Wallet`].
 */
class ChangeSet {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ChangeSet.prototype);
        obj.__wbg_ptr = ptr;
        ChangeSetFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ChangeSetFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_changeset_free(ptr, 0);
    }
    /**
     * Merge another [`ChangeSet`] into itself.
     * @param {ChangeSet} other
     */
    merge(other) {
        _assertClass(other, ChangeSet);
        var ptr0 = other.__destroy_into_raw();
        wasm.changeset_merge(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
        const ret = wasm.changeset_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Serialize `ChangeSet` to JSON.
     * @returns {string}
     */
    to_json() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.changeset_to_json(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Serialize `ChangeSet` to JSON compatible with WASM.
     * @returns {any}
     */
    to_js() {
        const ret = wasm.changeset_to_js(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Create a new `ChangeSet` from a JSON string.
     * @param {string} val
     * @returns {ChangeSet}
     */
    static from_json(val) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(val, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.changeset_from_json(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return ChangeSet.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Create a new `ChangeSet` from a JS object.
     * @param {any} js_value
     * @returns {ChangeSet}
     */
    static from_js(js_value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.changeset_from_js(retptr, addHeapObject(js_value));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return ChangeSet.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.ChangeSet = ChangeSet;

const CheckPointFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_checkpoint_free(ptr >>> 0, 1));
/**
 * A checkpoint is a node of a reference-counted linked list of [`BlockId`]s.
 *
 * Checkpoints are cheaply cloneable and are useful to find the agreement point between two sparse
 * block chains.
 */
class CheckPoint {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CheckPoint.prototype);
        obj.__wbg_ptr = ptr;
        CheckPointFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CheckPointFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_checkpoint_free(ptr, 0);
    }
    /**
     * Get the [`BlockId`] of the checkpoint.
     * @returns {BlockId}
     */
    get block_id() {
        const ret = wasm.checkpoint_block_id(this.__wbg_ptr);
        return BlockId.__wrap(ret);
    }
    /**
     * Get the height of the checkpoint.
     * @returns {number}
     */
    get height() {
        const ret = wasm.checkpoint_height(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get the block hash of the checkpoint.
     * @returns {string}
     */
    get hash() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.checkpoint_hash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the previous checkpoint in the chain
     * @returns {CheckPoint | undefined}
     */
    get prev() {
        const ret = wasm.checkpoint_prev(this.__wbg_ptr);
        return ret === 0 ? undefined : CheckPoint.__wrap(ret);
    }
    /**
     * Get checkpoint at `height`.
     *
     * Returns `None` if checkpoint at `height` does not exist.
     * @param {number} height
     * @returns {CheckPoint | undefined}
     */
    get(height) {
        const ret = wasm.checkpoint_get(this.__wbg_ptr, height);
        return ret === 0 ? undefined : CheckPoint.__wrap(ret);
    }
}
module.exports.CheckPoint = CheckPoint;

const ConfirmationBlockTimeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_confirmationblocktime_free(ptr >>> 0, 1));
/**
 * Represents the observed position of some chain data.
 */
class ConfirmationBlockTime {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ConfirmationBlockTime.prototype);
        obj.__wbg_ptr = ptr;
        ConfirmationBlockTimeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ConfirmationBlockTimeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_confirmationblocktime_free(ptr, 0);
    }
    /**
     * The anchor block.
     * @returns {BlockId}
     */
    get block_id() {
        const ret = wasm.confirmationblocktime_block_id(this.__wbg_ptr);
        return BlockId.__wrap(ret);
    }
    /**
     * The confirmation time of the transaction being anchored.
     * @returns {bigint}
     */
    get confirmation_time() {
        const ret = wasm.confirmationblocktime_confirmation_time(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
}
module.exports.ConfirmationBlockTime = ConfirmationBlockTime;

const DescriptorPairFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_descriptorpair_free(ptr >>> 0, 1));
/**
 * Pair of descriptors for external and internal keychains
 */
class DescriptorPair {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DescriptorPair.prototype);
        obj.__wbg_ptr = ptr;
        DescriptorPairFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DescriptorPairFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_descriptorpair_free(ptr, 0);
    }
    /**
     * @param {string} external
     * @param {string} internal
     */
    constructor(external, internal) {
        const ptr0 = passStringToWasm0(external, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(internal, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.descriptorpair_new(ptr0, len0, ptr1, len1);
        this.__wbg_ptr = ret >>> 0;
        DescriptorPairFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    get internal() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.descriptorpair_internal(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get external() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.descriptorpair_external(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.DescriptorPair = DescriptorPair;

const FeeEstimatesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_feeestimates_free(ptr >>> 0, 1));
/**
 * Map where the key is the confirmation target (in number of blocks) and the value is the estimated feerate (in sat/vB).
 */
class FeeEstimates {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FeeEstimatesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_feeestimates_free(ptr, 0);
    }
    /**
     * Returns the feerate (in sat/vB) or undefined.
     * Available confirmation targets are 1-25, 144, 504 and 1008 blocks.
     * @param {number} k
     * @returns {number | undefined}
     */
    get(k) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.feeestimates_get(retptr, this.__wbg_ptr, k);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getFloat64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : r2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.FeeEstimates = FeeEstimates;

const FeeRateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_feerate_free(ptr >>> 0, 1));
/**
 * Represents fee rate.
 *
 * This is an integer newtype representing fee rate in `sat/kwu`. It provides protection against mixing
 * up the types as well as basic formatting features.
 */
class FeeRate {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FeeRate.prototype);
        obj.__wbg_ptr = ptr;
        FeeRateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FeeRateFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_feerate_free(ptr, 0);
    }
    /**
     * @param {bigint} sat_vb
     */
    constructor(sat_vb) {
        const ret = wasm.feerate_new(sat_vb);
        this.__wbg_ptr = ret >>> 0;
        FeeRateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Returns raw fee rate.
     * @returns {bigint}
     */
    get to_sat_per_kwu() {
        const ret = wasm.amount_to_sat(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Converts to sat/vB rounding up.
     * @returns {bigint}
     */
    get to_sat_per_vb_ceil() {
        const ret = wasm.feerate_to_sat_per_vb_ceil(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Converts to sat/vB rounding down.
     * @returns {bigint}
     */
    get to_sat_per_vb_floor() {
        const ret = wasm.feerate_to_sat_per_vb_floor(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
}
module.exports.FeeRate = FeeRate;

const FullScanRequestFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_fullscanrequest_free(ptr >>> 0, 1));
/**
 * Data required to perform a spk-based blockchain client full scan.
 *
 * A client full scan iterates through all the scripts for the given keychains, fetching relevant
 * data until some stop gap number of scripts is found that have no data. This operation is
 * generally only used when importing or restoring previously used keychains in which the list of
 * used scripts is not known.
 */
class FullScanRequest {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FullScanRequest.prototype);
        obj.__wbg_ptr = ptr;
        FullScanRequestFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FullScanRequestFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fullscanrequest_free(ptr, 0);
    }
}
module.exports.FullScanRequest = FullScanRequest;

const LocalOutputFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_localoutput_free(ptr >>> 0, 1));
/**
 * A reference to a transaction output.
 */
class LocalOutput {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(LocalOutput.prototype);
        obj.__wbg_ptr = ptr;
        LocalOutputFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LocalOutputFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_localoutput_free(ptr, 0);
    }
    /**
     * Transaction output
     * @returns {TxOut}
     */
    get txout() {
        const ret = wasm.localoutput_txout(this.__wbg_ptr);
        return TxOut.__wrap(ret);
    }
    /**
     * The derivation index for the script pubkey in the wallet
     * @returns {number}
     */
    get derivation_index() {
        const ret = wasm.localoutput_derivation_index(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Reference to a transaction output
     * @returns {OutPoint}
     */
    get outpoint() {
        const ret = wasm.localoutput_outpoint(this.__wbg_ptr);
        return OutPoint.__wrap(ret);
    }
    /**
     * Type of keychain
     * @returns {KeychainKind}
     */
    get keychain() {
        const ret = wasm.localoutput_keychain(this.__wbg_ptr);
        return __wbindgen_enum_KeychainKind[ret];
    }
}
module.exports.LocalOutput = LocalOutput;

const OutPointFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_outpoint_free(ptr >>> 0, 1));
/**
 * A reference to a transaction output.
 */
class OutPoint {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OutPoint.prototype);
        obj.__wbg_ptr = ptr;
        OutPointFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof OutPoint)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OutPointFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_outpoint_free(ptr, 0);
    }
    /**
     * @param {Txid} txid
     * @param {number} vout
     */
    constructor(txid, vout) {
        _assertClass(txid, Txid);
        var ptr0 = txid.__destroy_into_raw();
        const ret = wasm.outpoint_new(ptr0, vout);
        this.__wbg_ptr = ret >>> 0;
        OutPointFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} outpoint_str
     * @returns {OutPoint}
     */
    static from_string(outpoint_str) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(outpoint_str, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.outpoint_from_string(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return OutPoint.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * The index of the referenced output in its transaction's vout.
     * @returns {number}
     */
    get vout() {
        const ret = wasm.blockid_height(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * The referenced transaction's txid.
     * @returns {Txid}
     */
    get txid() {
        const ret = wasm.outpoint_txid(this.__wbg_ptr);
        return Txid.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.outpoint_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.OutPoint = OutPoint;

const PsbtFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_psbt_free(ptr >>> 0, 1));
/**
 * A Partially Signed Transaction.
 */
class Psbt {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Psbt.prototype);
        obj.__wbg_ptr = ptr;
        PsbtFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PsbtFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_psbt_free(ptr, 0);
    }
    /**
     * @returns {Transaction}
     */
    extract_tx() {
        try {
            const ptr = this.__destroy_into_raw();
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.psbt_extract_tx(retptr, ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Transaction.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {FeeRate} max_fee_rate
     * @returns {Transaction}
     */
    extract_tx_with_fee_rate_limit(max_fee_rate) {
        try {
            const ptr = this.__destroy_into_raw();
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(max_fee_rate, FeeRate);
            var ptr0 = max_fee_rate.__destroy_into_raw();
            wasm.psbt_extract_tx_with_fee_rate_limit(retptr, ptr, ptr0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Transaction.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Amount}
     */
    fee() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.psbt_fee(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Amount.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Amount | undefined}
     */
    fee_amount() {
        const ret = wasm.psbt_fee_amount(this.__wbg_ptr);
        return ret === 0 ? undefined : Amount.__wrap(ret);
    }
    /**
     * @returns {FeeRate | undefined}
     */
    fee_rate() {
        const ret = wasm.psbt_fee_rate(this.__wbg_ptr);
        return ret === 0 ? undefined : FeeRate.__wrap(ret);
    }
    /**
     * Serialize the PSBT to a string in base64 format
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.psbt_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Create a PSBT from a base64 string
     * @param {string} val
     * @returns {Psbt}
     */
    static from_string(val) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(val, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.psbt_from_string(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Psbt.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Serialize `Psbt` to JSON.
     * @returns {string}
     */
    to_json() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.psbt_to_json(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.Psbt = Psbt;

const RecipientFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_recipient_free(ptr >>> 0, 1));
/**
 * A Transaction recipient
 */
class Recipient {

    static __unwrap(jsValue) {
        if (!(jsValue instanceof Recipient)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RecipientFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_recipient_free(ptr, 0);
    }
    /**
     * @param {Address} address
     * @param {Amount} amount
     */
    constructor(address, amount) {
        _assertClass(address, Address);
        var ptr0 = address.__destroy_into_raw();
        _assertClass(amount, Amount);
        var ptr1 = amount.__destroy_into_raw();
        const ret = wasm.recipient_new(ptr0, ptr1);
        this.__wbg_ptr = ret >>> 0;
        RecipientFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Address}
     */
    get address() {
        const ret = wasm.recipient_address(this.__wbg_ptr);
        return Address.__wrap(ret);
    }
    /**
     * @returns {Amount}
     */
    get amount() {
        const ret = wasm.recipient_amount(this.__wbg_ptr);
        return Amount.__wrap(ret);
    }
}
module.exports.Recipient = Recipient;

const ScriptBufFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_scriptbuf_free(ptr >>> 0, 1));
/**
 * An owned, growable script.
 *
 * `ScriptBuf` is the most common script type that has the ownership over the contents of the
 * script. It has a close relationship with its borrowed counterpart, [`Script`].
 */
class ScriptBuf {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ScriptBuf.prototype);
        obj.__wbg_ptr = ptr;
        ScriptBufFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ScriptBufFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_scriptbuf_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.scriptbuf_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    as_bytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.scriptbuf_as_bytes(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.ScriptBuf = ScriptBuf;

const SentAndReceivedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_sentandreceived_free(ptr >>> 0, 1));

class SentAndReceived {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SentAndReceived.prototype);
        obj.__wbg_ptr = ptr;
        SentAndReceivedFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SentAndReceivedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sentandreceived_free(ptr, 0);
    }
    /**
     * @returns {Amount}
     */
    get 0() {
        const ret = wasm.__wbg_get_sentandreceived_0(this.__wbg_ptr);
        return Amount.__wrap(ret);
    }
    /**
     * @param {Amount} arg0
     */
    set 0(arg0) {
        _assertClass(arg0, Amount);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_sentandreceived_0(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Amount}
     */
    get 1() {
        const ret = wasm.__wbg_get_sentandreceived_1(this.__wbg_ptr);
        return Amount.__wrap(ret);
    }
    /**
     * @param {Amount} arg0
     */
    set 1(arg0) {
        _assertClass(arg0, Amount);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_sentandreceived_1(this.__wbg_ptr, ptr0);
    }
}
module.exports.SentAndReceived = SentAndReceived;

const SpkIndexedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_spkindexed_free(ptr >>> 0, 1));

class SpkIndexed {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SpkIndexed.prototype);
        obj.__wbg_ptr = ptr;
        SpkIndexedFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SpkIndexedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_spkindexed_free(ptr, 0);
    }
    /**
     * @returns {KeychainKind}
     */
    get 0() {
        const ret = wasm.__wbg_get_spkindexed_0(this.__wbg_ptr);
        return __wbindgen_enum_KeychainKind[ret];
    }
    /**
     * @param {KeychainKind} arg0
     */
    set 0(arg0) {
        wasm.__wbg_set_spkindexed_0(this.__wbg_ptr, (__wbindgen_enum_KeychainKind.indexOf(arg0) + 1 || 3) - 1);
    }
    /**
     * @returns {number}
     */
    get 1() {
        const ret = wasm.__wbg_get_spkindexed_1(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set 1(arg0) {
        wasm.__wbg_set_spkindexed_1(this.__wbg_ptr, arg0);
    }
}
module.exports.SpkIndexed = SpkIndexed;

const SyncRequestFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_syncrequest_free(ptr >>> 0, 1));
/**
 * Data required to perform a spk-based blockchain client sync.
 *
 * A client sync fetches relevant chain data for a known list of scripts, transaction ids and
 * outpoints.
 */
class SyncRequest {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SyncRequest.prototype);
        obj.__wbg_ptr = ptr;
        SyncRequestFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SyncRequestFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_syncrequest_free(ptr, 0);
    }
}
module.exports.SyncRequest = SyncRequest;

const TransactionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transaction_free(ptr >>> 0, 1));
/**
 * Bitcoin transaction.
 *
 * An authenticated movement of coins.
 */
class Transaction {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Transaction.prototype);
        obj.__wbg_ptr = ptr;
        TransactionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transaction_free(ptr, 0);
    }
    /**
     * Returns the base transaction size.
     *
     * > Base transaction size is the size of the transaction serialised with the witness data stripped.
     * @returns {number}
     */
    get base_size() {
        const ret = wasm.transaction_base_size(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Returns the total transaction size.
     *
     * > Total transaction size is the transaction size in bytes serialized as described in BIP144,
     * > including base data and witness data.
     * @returns {number}
     */
    get total_size() {
        const ret = wasm.transaction_total_size(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Returns the "virtual size" (vsize) of this transaction.
     *
     * Will be `ceil(weight / 4.0)`. Note this implements the virtual size as per [`BIP141`], which
     * is different to what is implemented in Bitcoin Core. The computation should be the same for
     * any remotely sane transaction, and a standardness-rule-correct version is available in the
     * [`policy`] module.
     *
     * > Virtual transaction size is defined as Transaction weight / 4 (rounded up to the next integer).
     * @returns {number}
     */
    get vsize() {
        const ret = wasm.transaction_vsize(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Computes the [`Txid`].
     *
     * Hashes the transaction **excluding** the segwit data (i.e. the marker, flag bytes, and the
     * witness fields themselves). For non-segwit transactions which do not have any segwit data,
     * this will be equal to [`Transaction::compute_wtxid()`].
     * @returns {Txid}
     */
    compute_txid() {
        const ret = wasm.transaction_compute_txid(this.__wbg_ptr);
        return Txid.__wrap(ret);
    }
    /**
     * List of transaction inputs.
     * @returns {TxIn[]}
     */
    get input() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transaction_input(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * List of transaction outputs.
     * @returns {TxOut[]}
     */
    get output() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transaction_output(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Checks if this is a coinbase transaction.
     *
     * The first transaction in the block distributes the mining reward and is called the coinbase
     * transaction. It is impossible to check if the transaction is first in the block, so this
     * function checks the structure of the transaction instead - the previous output must be
     * all-zeros (creates satoshis "out of thin air").
     * @returns {boolean}
     */
    get is_coinbase() {
        const ret = wasm.transaction_is_coinbase(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Returns `true` if the transaction itself opted in to be BIP-125-replaceable (RBF).
     *
     * # Warning
     *
     * **Incorrectly relying on RBF may lead to monetary loss!**
     *
     * This **does not** cover the case where a transaction becomes replaceable due to ancestors
     * being RBF. Please note that transactions **may be replaced** even if they **do not** include
     * the RBF signal: <https://bitcoinops.org/en/newsletters/2022/10/19/#transaction-replacement-option>.
     * @returns {boolean}
     */
    get is_explicitly_rbf() {
        const ret = wasm.transaction_is_explicitly_rbf(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Returns `true` if this transactions nLockTime is enabled ([BIP-65]).
     * @returns {boolean}
     */
    get is_lock_time_enabled() {
        const ret = wasm.transaction_is_lock_time_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Returns the input at `input_index` if it exists.
     * @param {number} input_index
     * @returns {TxIn}
     */
    tx_in(input_index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transaction_tx_in(retptr, this.__wbg_ptr, input_index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return TxIn.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Returns the output at `output_index` if it exists.
     * @param {number} output_index
     * @returns {TxOut}
     */
    tx_out(output_index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.transaction_tx_out(retptr, this.__wbg_ptr, output_index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return TxOut.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Transaction}
     */
    clone() {
        const ret = wasm.transaction_clone(this.__wbg_ptr);
        return Transaction.__wrap(ret);
    }
}
module.exports.Transaction = Transaction;

const TxBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_txbuilder_free(ptr >>> 0, 1));
/**
 * A transaction builder.
 *
 * A `TxBuilder` is created by calling [`build_tx`] or [`build_fee_bump`] on a wallet. After
 * assigning it, you set options on it until finally calling [`finish`] to consume the builder and
 * generate the transaction.
 *
 * Each option setting method on `TxBuilder` takes and returns a new builder so you can chain calls
 */
class TxBuilder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TxBuilder.prototype);
        obj.__wbg_ptr = ptr;
        TxBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TxBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_txbuilder_free(ptr, 0);
    }
    /**
     * Replace the recipients already added with a new list
     * @param {Recipient[]} recipients
     * @returns {TxBuilder}
     */
    set_recipients(recipients) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passArrayJsValueToWasm0(recipients, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.txbuilder_set_recipients(ptr, ptr0, len0);
        return TxBuilder.__wrap(ret);
    }
    /**
     * Add a recipient to the internal list
     * @param {Recipient} recipient
     * @returns {TxBuilder}
     */
    add_recipient(recipient) {
        const ptr = this.__destroy_into_raw();
        _assertClass(recipient, Recipient);
        var ptr0 = recipient.__destroy_into_raw();
        const ret = wasm.txbuilder_add_recipient(ptr, ptr0);
        return TxBuilder.__wrap(ret);
    }
    /**
     * Replace the internal list of unspendable utxos with a new list
     * @param {OutPoint[]} unspendable
     * @returns {TxBuilder}
     */
    unspendable(unspendable) {
        const ptr = this.__destroy_into_raw();
        const ptr0 = passArrayJsValueToWasm0(unspendable, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.txbuilder_unspendable(ptr, ptr0, len0);
        return TxBuilder.__wrap(ret);
    }
    /**
     * Add a utxo to the internal list of unspendable utxos
     * @param {OutPoint} outpoint
     * @returns {TxBuilder}
     */
    add_unspendable(outpoint) {
        const ptr = this.__destroy_into_raw();
        _assertClass(outpoint, OutPoint);
        var ptr0 = outpoint.__destroy_into_raw();
        const ret = wasm.txbuilder_add_unspendable(ptr, ptr0);
        return TxBuilder.__wrap(ret);
    }
    /**
     * Set a custom fee rate.
     *
     * This method sets the mining fee paid by the transaction as a rate on its size.
     * This means that the total fee paid is equal to `fee_rate` times the size
     * of the transaction. Default is 1 sat/vB in accordance with Bitcoin Core's default
     * relay policy.
     *
     * Note that this is really a minimum feerate -- it's possible to
     * overshoot it slightly since adding a change output to drain the remaining
     * excess might not be viable.
     * @param {FeeRate} fee_rate
     * @returns {TxBuilder}
     */
    fee_rate(fee_rate) {
        const ptr = this.__destroy_into_raw();
        _assertClass(fee_rate, FeeRate);
        var ptr0 = fee_rate.__destroy_into_raw();
        const ret = wasm.txbuilder_fee_rate(ptr, ptr0);
        return TxBuilder.__wrap(ret);
    }
    /**
     * Spend all the available inputs. This respects filters like [`TxBuilder::unspendable`] and the change policy.
     * @returns {TxBuilder}
     */
    drain_wallet() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.txbuilder_drain_wallet(ptr);
        return TxBuilder.__wrap(ret);
    }
    /**
     * Sets the address to *drain* excess coins to.
     *
     * Usually, when there are excess coins they are sent to a change address generated by the
     * wallet. This option replaces the usual change address with an arbitrary `script_pubkey` of
     * your choosing. Just as with a change output, if the drain output is not needed (the excess
     * coins are too small) it will not be included in the resulting transaction. The only
     * difference is that it is valid to use `drain_to` without setting any ordinary recipients
     * with [`add_recipient`] (but it is perfectly fine to add recipients as well).
     *
     * If you choose not to set any recipients, you should provide the utxos that the
     * transaction should spend via [`add_utxos`].
     * @param {Address} address
     * @returns {TxBuilder}
     */
    drain_to(address) {
        const ptr = this.__destroy_into_raw();
        _assertClass(address, Address);
        var ptr0 = address.__destroy_into_raw();
        const ret = wasm.txbuilder_drain_to(ptr, ptr0);
        return TxBuilder.__wrap(ret);
    }
    /**
     * Set whether or not the dust limit is checked.
     *
     * **Note**: by avoiding a dust limit check you may end up with a transaction that is non-standard.
     * @param {boolean} allow_dust
     * @returns {TxBuilder}
     */
    allow_dust(allow_dust) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.txbuilder_allow_dust(ptr, allow_dust);
        return TxBuilder.__wrap(ret);
    }
    /**
     * Finish building the transaction.
     *
     * Returns a new [`Psbt`] per [`BIP174`].
     * @returns {Psbt}
     */
    finish() {
        try {
            const ptr = this.__destroy_into_raw();
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.txbuilder_finish(retptr, ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Psbt.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.TxBuilder = TxBuilder;

const TxInFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_txin_free(ptr >>> 0, 1));
/**
 * Bitcoin transaction input.
 *
 * It contains the location of the previous transaction's output,
 * that it spends and set of scripts that satisfy its spending
 * conditions.
 */
class TxIn {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TxIn.prototype);
        obj.__wbg_ptr = ptr;
        TxInFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TxInFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_txin_free(ptr, 0);
    }
    /**
     * The reference to the previous output that is being used as an input.
     * @returns {OutPoint}
     */
    get previous_output() {
        const ret = wasm.txin_previous_output(this.__wbg_ptr);
        return OutPoint.__wrap(ret);
    }
    /**
     * The script which pushes values on the stack which will cause
     * the referenced output's script to be accepted.
     * @returns {ScriptBuf}
     */
    get script_sig() {
        const ret = wasm.txin_script_sig(this.__wbg_ptr);
        return ScriptBuf.__wrap(ret);
    }
    /**
     * Returns the base size of this input.
     *
     * Base size excludes the witness data.
     * @returns {number}
     */
    get base_size() {
        const ret = wasm.txin_base_size(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Returns the total number of bytes that this input contributes to a transaction.
     *
     * Total size includes the witness data.
     * @returns {number}
     */
    get total_size() {
        const ret = wasm.txin_total_size(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Returns true if this input enables the [`absolute::LockTime`] (aka `nLockTime`) of its
     * [`Transaction`].
     *
     * `nLockTime` is enabled if *any* input enables it. See [`Transaction::is_lock_time_enabled`]
     *  to check the overall state. If none of the inputs enables it, the lock time value is simply
     *  ignored. If this returns false and OP_CHECKLOCKTIMEVERIFY is used in the redeem script with
     *  this input then the script execution will fail [BIP-0065].
     * @returns {boolean}
     */
    get enables_lock_time() {
        const ret = wasm.txin_enables_lock_time(this.__wbg_ptr);
        return ret !== 0;
    }
}
module.exports.TxIn = TxIn;

const TxOutFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_txout_free(ptr >>> 0, 1));
/**
 * Bitcoin transaction output.
 *
 * Defines new coins to be created as a result of the transaction,
 * along with spending conditions ("script", aka "output script"),
 * which an input spending it must satisfy.
 *
 * An output that is not yet spent by an input is called Unspent Transaction Output ("UTXO").
 */
class TxOut {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TxOut.prototype);
        obj.__wbg_ptr = ptr;
        TxOutFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TxOutFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_txout_free(ptr, 0);
    }
    /**
     * The value of the output, in satoshis.
     * @returns {Amount}
     */
    get value() {
        const ret = wasm.txout_value(this.__wbg_ptr);
        return Amount.__wrap(ret);
    }
    /**
     * The script which must be satisfied for the output to be spent.
     * @returns {ScriptBuf}
     */
    get script_pubkey() {
        const ret = wasm.txout_script_pubkey(this.__wbg_ptr);
        return ScriptBuf.__wrap(ret);
    }
    /**
     * Returns the total number of bytes that this output contributes to a transaction.
     *
     * There is no difference between base size vs total size for outputs.
     * @returns {number}
     */
    get size() {
        const ret = wasm.txout_size(this.__wbg_ptr);
        return ret >>> 0;
    }
}
module.exports.TxOut = TxOut;

const TxidFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_txid_free(ptr >>> 0, 1));
/**
 * A bitcoin transaction hash/transaction ID.
 */
class Txid {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Txid.prototype);
        obj.__wbg_ptr = ptr;
        TxidFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TxidFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_txid_free(ptr, 0);
    }
    /**
     * @param {string} txid_str
     * @returns {Txid}
     */
    static from_string(txid_str) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(txid_str, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.txid_from_string(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Txid.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.txid_toString(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}
module.exports.Txid = Txid;

const UpdateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_update_free(ptr >>> 0, 1));
/**
 * An update to [`Wallet`].
 */
class Update {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UpdateFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_update_free(ptr, 0);
    }
}
module.exports.Update = Update;

const WalletFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wallet_free(ptr >>> 0, 1));

class Wallet {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Wallet.prototype);
        obj.__wbg_ptr = ptr;
        WalletFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WalletFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wallet_free(ptr, 0);
    }
    /**
     * @param {Network} network
     * @param {string} external_descriptor
     * @param {string} internal_descriptor
     * @returns {Wallet}
     */
    static create(network, external_descriptor, internal_descriptor) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(external_descriptor, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(internal_descriptor, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len1 = WASM_VECTOR_LEN;
            wasm.wallet_create(retptr, (__wbindgen_enum_Network.indexOf(network) + 1 || 6) - 1, ptr0, len0, ptr1, len1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Wallet.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {ChangeSet} changeset
     * @param {string | null} [external_descriptor]
     * @param {string | null} [internal_descriptor]
     * @returns {Wallet}
     */
    static load(changeset, external_descriptor, internal_descriptor) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(changeset, ChangeSet);
            var ptr0 = changeset.__destroy_into_raw();
            var ptr1 = isLikeNone(external_descriptor) ? 0 : passStringToWasm0(external_descriptor, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            var len1 = WASM_VECTOR_LEN;
            var ptr2 = isLikeNone(internal_descriptor) ? 0 : passStringToWasm0(internal_descriptor, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            var len2 = WASM_VECTOR_LEN;
            wasm.wallet_load(retptr, ptr0, ptr1, len1, ptr2, len2);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Wallet.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FullScanRequest}
     */
    start_full_scan() {
        const ret = wasm.wallet_start_full_scan(this.__wbg_ptr);
        return FullScanRequest.__wrap(ret);
    }
    /**
     * @returns {SyncRequest}
     */
    start_sync_with_revealed_spks() {
        const ret = wasm.wallet_start_sync_with_revealed_spks(this.__wbg_ptr);
        return SyncRequest.__wrap(ret);
    }
    /**
     * @param {Update} update
     */
    apply_update(update) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(update, Update);
            var ptr0 = update.__destroy_into_raw();
            wasm.wallet_apply_update(retptr, this.__wbg_ptr, ptr0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Update} update
     * @param {bigint} seen_at
     */
    apply_update_at(update, seen_at) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(update, Update);
            var ptr0 = update.__destroy_into_raw();
            wasm.wallet_apply_update_at(retptr, this.__wbg_ptr, ptr0, seen_at);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Network}
     */
    get network() {
        const ret = wasm.wallet_network(this.__wbg_ptr);
        return __wbindgen_enum_Network[ret];
    }
    /**
     * @returns {Balance}
     */
    get balance() {
        const ret = wasm.wallet_balance(this.__wbg_ptr);
        return Balance.__wrap(ret);
    }
    /**
     * @param {KeychainKind} keychain
     * @returns {AddressInfo}
     */
    next_unused_address(keychain) {
        const ret = wasm.wallet_next_unused_address(this.__wbg_ptr, (__wbindgen_enum_KeychainKind.indexOf(keychain) + 1 || 3) - 1);
        return AddressInfo.__wrap(ret);
    }
    /**
     * @param {KeychainKind} keychain
     * @param {number} index
     * @returns {AddressInfo}
     */
    peek_address(keychain, index) {
        const ret = wasm.wallet_peek_address(this.__wbg_ptr, (__wbindgen_enum_KeychainKind.indexOf(keychain) + 1 || 3) - 1, index);
        return AddressInfo.__wrap(ret);
    }
    /**
     * @param {KeychainKind} keychain
     * @returns {AddressInfo}
     */
    reveal_next_address(keychain) {
        const ret = wasm.wallet_reveal_next_address(this.__wbg_ptr, (__wbindgen_enum_KeychainKind.indexOf(keychain) + 1 || 3) - 1);
        return AddressInfo.__wrap(ret);
    }
    /**
     * @param {KeychainKind} keychain
     * @param {number} index
     * @returns {AddressInfo[]}
     */
    reveal_addresses_to(keychain, index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wallet_reveal_addresses_to(retptr, this.__wbg_ptr, (__wbindgen_enum_KeychainKind.indexOf(keychain) + 1 || 3) - 1, index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {KeychainKind} keychain
     * @returns {AddressInfo[]}
     */
    list_unused_addresses(keychain) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wallet_list_unused_addresses(retptr, this.__wbg_ptr, (__wbindgen_enum_KeychainKind.indexOf(keychain) + 1 || 3) - 1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {LocalOutput[]}
     */
    list_unspent() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wallet_list_unspent(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {LocalOutput[]}
     */
    list_output() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wallet_list_output(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {OutPoint} op
     * @returns {LocalOutput | undefined}
     */
    get_utxo(op) {
        _assertClass(op, OutPoint);
        var ptr0 = op.__destroy_into_raw();
        const ret = wasm.wallet_get_utxo(this.__wbg_ptr, ptr0);
        return ret === 0 ? undefined : LocalOutput.__wrap(ret);
    }
    /**
     * @returns {WalletTx[]}
     */
    transactions() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wallet_transactions(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Txid} txid
     * @returns {WalletTx | undefined}
     */
    get_tx(txid) {
        _assertClass(txid, Txid);
        var ptr0 = txid.__destroy_into_raw();
        const ret = wasm.wallet_get_tx(this.__wbg_ptr, ptr0);
        return ret === 0 ? undefined : WalletTx.__wrap(ret);
    }
    /**
     * @returns {CheckPoint}
     */
    get latest_checkpoint() {
        const ret = wasm.wallet_latest_checkpoint(this.__wbg_ptr);
        return CheckPoint.__wrap(ret);
    }
    /**
     * @returns {ChangeSet | undefined}
     */
    take_staged() {
        const ret = wasm.wallet_take_staged(this.__wbg_ptr);
        return ret === 0 ? undefined : ChangeSet.__wrap(ret);
    }
    /**
     * @param {KeychainKind} keychain
     * @returns {string}
     */
    public_descriptor(keychain) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wallet_public_descriptor(retptr, this.__wbg_ptr, (__wbindgen_enum_KeychainKind.indexOf(keychain) + 1 || 3) - 1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {Psbt} psbt
     * @returns {boolean}
     */
    sign(psbt) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(psbt, Psbt);
            wasm.wallet_sign(retptr, this.__wbg_ptr, psbt.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return r0 !== 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {KeychainKind} keychain
     * @returns {number | undefined}
     */
    derivation_index(keychain) {
        const ret = wasm.wallet_derivation_index(this.__wbg_ptr, (__wbindgen_enum_KeychainKind.indexOf(keychain) + 1 || 3) - 1);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {TxBuilder}
     */
    build_tx() {
        const ret = wasm.wallet_build_tx(this.__wbg_ptr);
        return TxBuilder.__wrap(ret);
    }
    /**
     * @param {Transaction} tx
     * @returns {Amount}
     */
    calculate_fee(tx) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(tx, Transaction);
            var ptr0 = tx.__destroy_into_raw();
            wasm.wallet_calculate_fee(retptr, this.__wbg_ptr, ptr0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Amount.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Transaction} tx
     * @returns {FeeRate}
     */
    calculate_fee_rate(tx) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(tx, Transaction);
            var ptr0 = tx.__destroy_into_raw();
            wasm.wallet_calculate_fee_rate(retptr, this.__wbg_ptr, ptr0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return FeeRate.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Transaction} tx
     * @returns {SentAndReceived}
     */
    sent_and_received(tx) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(tx, Transaction);
            var ptr0 = tx.__destroy_into_raw();
            wasm.wallet_sent_and_received(retptr, this.__wbg_ptr, ptr0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return SentAndReceived.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {ScriptBuf} script
     * @returns {boolean}
     */
    is_mine(script) {
        _assertClass(script, ScriptBuf);
        var ptr0 = script.__destroy_into_raw();
        const ret = wasm.wallet_is_mine(this.__wbg_ptr, ptr0);
        return ret !== 0;
    }
    /**
     * @param {ScriptBuf} spk
     * @returns {SpkIndexed | undefined}
     */
    derivation_of_spk(spk) {
        _assertClass(spk, ScriptBuf);
        var ptr0 = spk.__destroy_into_raw();
        const ret = wasm.wallet_derivation_of_spk(this.__wbg_ptr, ptr0);
        return ret === 0 ? undefined : SpkIndexed.__wrap(ret);
    }
}
module.exports.Wallet = Wallet;

const WalletTxFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wallettx_free(ptr >>> 0, 1));
/**
 * A Transaction managed by a `Wallet`.
 */
class WalletTx {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WalletTx.prototype);
        obj.__wbg_ptr = ptr;
        WalletTxFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WalletTxFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wallettx_free(ptr, 0);
    }
    /**
     * Txid of the transaction.
     * @returns {Txid}
     */
    get txid() {
        const ret = wasm.wallettx_txid(this.__wbg_ptr);
        return Txid.__wrap(ret);
    }
    /**
     * A partial or full representation of the transaction.
     * @returns {Transaction}
     */
    get tx() {
        const ret = wasm.wallettx_tx(this.__wbg_ptr);
        return Transaction.__wrap(ret);
    }
    /**
     * The blocks that the transaction is "anchored" in.
     * @returns {ConfirmationBlockTime[]}
     */
    get anchors() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wallettx_anchors(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * The last-seen unix timestamp of the transaction as unconfirmed.
     * @returns {bigint | undefined}
     */
    get last_seen_unconfirmed() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wallettx_last_seen_unconfirmed(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * How the transaction is observed in the canonical chain (confirmed or unconfirmed).
     * @returns {ChainPosition}
     */
    get chain_position() {
        const ret = wasm.wallettx_chain_position(this.__wbg_ptr);
        return ChainPosition.__wrap(ret);
    }
}
module.exports.WalletTx = WalletTx;

module.exports.__wbg_String_8f0eb39a4a4c2f66 = function(arg0, arg1) {
    const ret = String(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbg_addressinfo_new = function(arg0) {
    const ret = AddressInfo.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

module.exports.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_confirmationblocktime_new = function(arg0) {
    const ret = ConfirmationBlockTime.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_crypto_ed58b8e10a292839 = function(arg0) {
    const ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

module.exports.__wbg_done_769e5ede4b31c67b = function(arg0) {
    const ret = getObject(arg0).done;
    return ret;
};

module.exports.__wbg_entries_3265d4158b33e5dc = function(arg0) {
    const ret = Object.entries(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_getRandomValues_bcb4912f16000dc4 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
}, arguments) };

module.exports.__wbg_get_67b2ba62fc30de12 = function() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_get_b9b93047fe3cf45b = function(arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
};

module.exports.__wbg_getwithrefkey_1dc361bd10053bfe = function(arg0, arg1) {
    const ret = getObject(arg0)[getObject(arg1)];
    return addHeapObject(ret);
};

module.exports.__wbg_instanceof_ArrayBuffer_e14585432e3737fc = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

module.exports.__wbg_instanceof_Uint8Array_17156bcf118086a9 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

module.exports.__wbg_isArray_a1eab7e0d067391b = function(arg0) {
    const ret = Array.isArray(getObject(arg0));
    return ret;
};

module.exports.__wbg_isSafeInteger_343e2beeeece1bb0 = function(arg0) {
    const ret = Number.isSafeInteger(getObject(arg0));
    return ret;
};

module.exports.__wbg_iterator_9a24c88df860dc65 = function() {
    const ret = Symbol.iterator;
    return addHeapObject(ret);
};

module.exports.__wbg_length_a446193dc22c12f8 = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

module.exports.__wbg_length_e2d2a49132c1b256 = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

module.exports.__wbg_localoutput_new = function(arg0) {
    const ret = LocalOutput.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_msCrypto_0a36e2ec3a343d26 = function(arg0) {
    const ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};

module.exports.__wbg_new_405e22f390576ce2 = function() {
    const ret = new Object();
    return addHeapObject(ret);
};

module.exports.__wbg_new_5e0be73521bc8c17 = function() {
    const ret = new Map();
    return addHeapObject(ret);
};

module.exports.__wbg_new_78feb108b6472713 = function() {
    const ret = new Array();
    return addHeapObject(ret);
};

module.exports.__wbg_new_a12002a7f91c75be = function(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_next_25feadfc0913fea9 = function(arg0) {
    const ret = getObject(arg0).next;
    return addHeapObject(ret);
};

module.exports.__wbg_next_6574e1a8a62d1055 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).next();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_node_02999533c4ea02e3 = function(arg0) {
    const ret = getObject(arg0).node;
    return addHeapObject(ret);
};

module.exports.__wbg_now_807e54c39636c349 = function() {
    const ret = Date.now();
    return ret;
};

module.exports.__wbg_outpoint_unwrap = function(arg0) {
    const ret = OutPoint.__unwrap(takeObject(arg0));
    return ret;
};

module.exports.__wbg_process_5c1d670bc53614b8 = function(arg0) {
    const ret = getObject(arg0).process;
    return addHeapObject(ret);
};

module.exports.__wbg_randomFillSync_ab2cfe79ebbf2740 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).randomFillSync(takeObject(arg1));
}, arguments) };

module.exports.__wbg_recipient_unwrap = function(arg0) {
    const ret = Recipient.__unwrap(takeObject(arg0));
    return ret;
};

module.exports.__wbg_require_79b1e9274cde3c87 = function() { return handleError(function () {
    const ret = module.require;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_set_37837023f3d740e8 = function(arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
};

module.exports.__wbg_set_3f1d0b984ed272ed = function(arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
};

module.exports.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

module.exports.__wbg_set_8fc6bf8a5b1071d1 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

module.exports.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

module.exports.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

module.exports.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

module.exports.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

module.exports.__wbg_subarray_aa9065fa9dc5df96 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_txin_new = function(arg0) {
    const ret = TxIn.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_txout_new = function(arg0) {
    const ret = TxOut.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_value_cd1ffa7b1ab794f1 = function(arg0) {
    const ret = getObject(arg0).value;
    return addHeapObject(ret);
};

module.exports.__wbg_versions_c71aa1626a93e0a1 = function(arg0) {
    const ret = getObject(arg0).versions;
    return addHeapObject(ret);
};

module.exports.__wbg_wallettx_new = function(arg0) {
    const ret = WalletTx.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbindgen_as_number = function(arg0) {
    const ret = +getObject(arg0);
    return ret;
};

module.exports.__wbindgen_bigint_from_u64 = function(arg0) {
    const ret = BigInt.asUintN(64, arg0);
    return addHeapObject(ret);
};

module.exports.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
    const v = getObject(arg1);
    const ret = typeof(v) === 'bigint' ? v : undefined;
    getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

module.exports.__wbindgen_boolean_get = function(arg0) {
    const v = getObject(arg0);
    const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};

module.exports.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbindgen_error_new = function(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbindgen_in = function(arg0, arg1) {
    const ret = getObject(arg0) in getObject(arg1);
    return ret;
};

module.exports.__wbindgen_is_bigint = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'bigint';
    return ret;
};

module.exports.__wbindgen_is_function = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

module.exports.__wbindgen_is_object = function(arg0) {
    const val = getObject(arg0);
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

module.exports.__wbindgen_is_string = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'string';
    return ret;
};

module.exports.__wbindgen_is_undefined = function(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};

module.exports.__wbindgen_jsval_eq = function(arg0, arg1) {
    const ret = getObject(arg0) === getObject(arg1);
    return ret;
};

module.exports.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
    const ret = getObject(arg0) == getObject(arg1);
    return ret;
};

module.exports.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};

module.exports.__wbindgen_number_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

module.exports.__wbindgen_number_new = function(arg0) {
    const ret = arg0;
    return addHeapObject(ret);
};

module.exports.__wbindgen_object_clone_ref = function(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

module.exports.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

module.exports.__wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

const path = require('path').join(__dirname, 'bitcoindevkit_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

