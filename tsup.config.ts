import { defineConfig } from 'tsup';
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  target: 'node18',
  dts: true, // Generate DTS manually via build:dts script to work around type resolution issues
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  outExtension: ({ format }) => ({
    js: format === 'cjs' ? '.cjs' : '.mjs'
  }),
});