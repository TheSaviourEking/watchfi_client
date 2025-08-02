import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import rollupAnalyzer from 'rollup-plugin-analyzer';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true, // Polyfill Buffer
        process: true, // Polyfill process
      },
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),
    rollupAnalyzer(),
  ],
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
      vm: 'vm-browserify',
      util: 'util',
      events: 'events',
    },
  },
  optimizeDeps: {
    include: [
      'buffer',
      'crypto-browserify',
      'stream-browserify',
      'events',
      'util',
      'vm-browserify',
      'eventemitter3',
    ],
    exclude: ['@toruslabs/eccrypto'],
    force: true,
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'SOURCEMAP_ERROR') return;
        warn(warning);
      },
      output: {
        manualChunks: {
          'geo-data': ['country-state-city'],
          'react-vendor': ['react', 'react-dom'],
          solana: [
            '@solana/web3.js',
            '@solana/wallet-adapter-react',
            '@solana/wallet-adapter-react-ui',
            '@solana/wallet-adapter-base',
            '@solana/spl-token',
          ],
          'ui-components': [
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            'lucide-react',
          ],
          utils: ['axios', 'clsx', 'class-variance-authority', 'tailwind-merge'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          'state-routing': ['zustand', 'react-router'],
        },
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});