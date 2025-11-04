/**
 * Network utility functions
 */

import type { Network } from '../crypto/types';
import { NETWORK_MAP } from '../constants';
import { ValidationError } from '../errors';

/**
 * Normalize network string or number to Network type
 */
export function normalizeNetwork(network: string | number): Network {
  const key = String(network);
  const normalized = NETWORK_MAP[key as keyof typeof NETWORK_MAP];
  
  if (!normalized) {
    throw new ValidationError(`Invalid network: ${network}`, 'network');
  }
  
  return normalized;
}

/**
 * Check if value is a valid network
 */
export function isNetwork(value: unknown): value is Network {
  if (typeof value !== 'string') return false;
  const normalized = NETWORK_MAP[value as keyof typeof NETWORK_MAP];
  return !!normalized && (normalized === 'mainnet' || normalized === 'testnet' || normalized === 'signet' || normalized === 'regtest');
}

