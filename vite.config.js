import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import rollupAnalyzer from 'rollup-plugin-analyzer';
// import { analyzer } from 'rollup-plugin-analyzer'
// const { analyzer } = pkg;
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap' // Better visualization
    }),
    // analyzer({
    //   filename: 'dist/bundle-analysis.txt',
    //   showExports: true,
    //   limit: 20
    // })
    rollupAnalyzer()
  ],
  define: {
    global: 'globalThis',
    'process.env': {}
  },
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "crypto": "crypto-browserify",
      "stream": "stream-browserify",
      "buffer": "buffer",
      "vm": "vm-browserify",
      "util": "util",
      "events": "events"
    }
  },
  optimizeDeps: {
    include: [
      'buffer',
      'crypto-browserify',
      'stream-browserify',
      'events',
      'util',
      'vm-browserify',
      'eventemitter3'
    ],
    // Only exclude truly problematic packages, not ones we want to chunk
    exclude: [
      '@toruslabs/eccrypto'
    ],
    force: true
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'SOURCEMAP_ERROR') return
        warn(warning)
      },
      output: {
        // Only chunk libraries that are NOT excluded in optimizeDeps
        manualChunks: {
          // Heavy geo data - chunk this to load on demand
          'geo-data': [
            'country-state-city'
          ],
          // Core React libraries
          'react-vendor': [
            'react',
            'react-dom'
          ],
          // Solana libraries - these work because they're not excluded
          'solana': [
            '@solana/web3.js',
            '@solana/wallet-adapter-react',
            '@solana/wallet-adapter-react-ui',
            '@solana/wallet-adapter-base',
            '@solana/spl-token'
          ],
          // UI components
          'ui-components': [
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            'lucide-react'
          ],
          // Utilities
          'utils': [
            'axios',
            'clsx',
            'class-variance-authority',
            'tailwind-merge'
          ],
          // Forms
          'forms': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ],
          // State management & routing
          'state-routing': [
            'zustand',
            'react-router'
          ]
        },
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})