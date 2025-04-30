import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  outDir: 'dist',
  target: 'node18',
  dts: true,
  outExtension: () => ({ js: '.cjs' })
});