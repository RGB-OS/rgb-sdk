#!/usr/bin/env node
/**
 * Node.js wrapper with WASM modules support
 * This script can be used to run other Node.js scripts with WASM support
 * Usage: node scripts/node-with-wasm.js <your-script.js>
 */

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: node scripts/node-with-wasm.js <script.js> [args...]');
  process.exit(1);
}

// Run the script with --experimental-wasm-modules
const child = spawn('node', ['--experimental-wasm-modules', ...args], {
  stdio: 'inherit',
  cwd: process.cwd(),
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

