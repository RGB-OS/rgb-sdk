/**
 * Environment detection utilities
 * Helps determine if code is running in Node.js or browser environment
 */

/**
 * Check if code is running in Node.js environment
 */
export function isNode(): boolean {
  return (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null
  );
}

/**
 * Check if code is running in browser environment
 */
export function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined'
  );
}

/**
 * Get the current environment
 */
export type Environment = 'node' | 'browser' | 'unknown';

export function getEnvironment(): Environment {
  if (isNode()) return 'node';
  if (isBrowser()) return 'browser';
  return 'unknown';
}

