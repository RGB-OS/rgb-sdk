#!/bin/bash
# Wrapper script to run Node.js with WASM modules support
# Usage: ./scripts/node-with-wasm.sh <your-script.js>

exec node --experimental-wasm-modules "$@"

