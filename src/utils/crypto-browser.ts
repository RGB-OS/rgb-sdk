/**
 * Browser-compatible crypto utilities
 * Provides crypto functions that work in both Node.js and browser environments
 */

import { isNode } from './environment';

/**
 * Create SHA256 hash (browser-compatible)
 */
export async function sha256(data: Uint8Array | Buffer): Promise<Uint8Array> {
  if (isNode()) {
    // Use Node.js crypto
    const { createHash } = await import('node:crypto');
    return createHash('sha256').update(data as any).digest();
  } else {
    // Use Web Crypto API - convert to ArrayBuffer if needed
    const buffer = data instanceof Uint8Array ? data.buffer : data;
    const arrayBuffer = buffer instanceof ArrayBuffer ? buffer : buffer.buffer;
    return new Uint8Array(
      await crypto.subtle.digest('SHA-256', arrayBuffer)
    );
  }
}

/**
 * Create RIPEMD160 hash (browser-compatible)
 * Note: Web Crypto API doesn't support RIPEMD160, so we need a polyfill
 */
export async function ripemd160(data: Uint8Array): Promise<Uint8Array> {
  if (isNode()) {
    // Use Node.js crypto
    const { createHash } = await import('node:crypto');
    return createHash('ripemd160').update(data).digest();
  } else {
    // Use polyfill for browser (you'll need to install a RIPEMD160 polyfill)
    // For now, we'll throw an error suggesting the polyfill
    throw new Error(
      'RIPEMD160 requires a polyfill in browser environments. ' +
      'Please use a library like crypto-js or install a RIPEMD160 polyfill.'
    );
  }
}

// Import crypto at module level for Node.js (works in both CJS and ESM)
let nodeCrypto: typeof import('node:crypto') | null = null;

async function getNodeCrypto() {
  if (!isNode()) {
    throw new Error('Node.js crypto is only available in Node.js environment');
  }
  if (!nodeCrypto) {
    nodeCrypto = await import('node:crypto');
  }
  return nodeCrypto;
}

/**
 * Create SHA256 hash synchronously (Node.js only)
 * For browser, use async sha256() instead
 */
export async function sha256Sync(data: Uint8Array | Buffer): Promise<Uint8Array> {
  if (!isNode()) {
    throw new Error('sha256Sync is only available in Node.js. Use sha256() in browsers.');
  }
  const crypto = await getNodeCrypto();
  return crypto.createHash('sha256').update(data as any).digest();
}

/**
 * Create RIPEMD160 hash synchronously (Node.js only)
 * For browser, use async ripemd160() instead
 */
export const ripemd160Sync: (data: Uint8Array | Buffer) => Promise<Uint8Array> = (data: Uint8Array | Buffer): Promise<Uint8Array> => {
  if (!isNode()) {
    throw new Error('ripemd160Sync is only available in Node.js. Use ripemd160() in browsers.');
  }
  return getNodeCrypto().then(crypto => crypto.createHash('ripemd160').update(data as any).digest());
};

