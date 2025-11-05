/**
 * Browser environment tests
 * 
 * Note: Full browser testing should be done manually using tests/browser-test.html
 * This test file verifies that the SDK correctly handles environment detection
 * and can be imported in a browser-like context.
 * 
 * For actual browser testing, use the HTML test page:
 * 1. Run: npm run build
 * 2. Open tests/browser-test.html in a browser (via HTTP server)
 */

describe('Browser Environment Support', () => {
  it('should export browser-compatible functions', async () => {
    const sdk = await import('../dist/index.mjs');
    
    // Verify all main functions are exported
    expect(sdk.generateKeys).toBeDefined();
    expect(sdk.deriveKeysFromMnemonic).toBeDefined();
    expect(sdk.signPsbt).toBeDefined();
    expect(sdk.restoreKeys).toBeDefined();
    expect(sdk.accountXpubsFromMnemonic).toBeDefined();
    
    // Verify functions are callable (async functions)
    expect(typeof sdk.generateKeys).toBe('function');
    expect(typeof sdk.deriveKeysFromMnemonic).toBe('function');
    expect(typeof sdk.signPsbt).toBe('function');
  });

  it('should work with environment detection utility', async () => {
    // Import the environment utility
    const { isNode, isBrowser, getEnvironment } = await import('../dist/index.mjs');
    
    // In Node.js test environment, isNode should be true
    expect(typeof isNode).toBe('function');
    expect(typeof isBrowser).toBe('function');
    expect(typeof getEnvironment).toBe('function');
    
    // The actual environment detection will depend on runtime
    const env = getEnvironment();
    expect(['node', 'browser', 'unknown']).toContain(env);
  });

  it('should have ESM build available for browser', async () => {
    // This test verifies the build output exists
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    // Get __dirname equivalent in ESM
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const esmBuildPath = path.join(__dirname, '../dist/index.mjs');
    expect(fs.existsSync(esmBuildPath)).toBe(true);
    
    // Verify it's a valid file
    const stats = fs.statSync(esmBuildPath);
    expect(stats.isFile()).toBe(true);
    expect(stats.size).toBeGreaterThan(0);
  });
});

