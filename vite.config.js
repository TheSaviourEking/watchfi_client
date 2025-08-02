import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
      "@": path.resolve(__dirname, "./src"),
    }
  },
  optimizeDeps: {
    include: [
      'crypto-browserify',
      'stream-browserify',
      'buffer'
    ],
    exclude: ['@toruslabs/eccrypto']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: ['@toruslabs/eccrypto'],
      output: {
        globals: {
          '@toruslabs/eccrypto': 'eccrypto'
        }
      }
    }
  }
})