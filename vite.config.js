import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'assets',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/liquid-glass-tabs.jsx'),
      name: 'LiquidGlassTabsInit',
      formats: ['iife'],
      fileName: () => 'liquid-glass-tabs.bundle.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
