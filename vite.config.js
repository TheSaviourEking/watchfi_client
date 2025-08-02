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
      "@": path.resolve(__dirname, "./src"),
      "zod/v4/core": "zod", // Redirect zod/v4/core to zod
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
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
      external: (id) => {
        return id.includes('@toruslabs/eccrypto') ||
          id === 'crypto' ||
          id === 'stream'
      },
      output: {
        globals: {
          '@toruslabs/eccrypto': 'eccrypto',
          'crypto': 'crypto',
          'stream': 'stream'
        }
      }
    }
  }
})

// https://vite.dev/config/
// export const defineConfd = ({
//   plugins: [
//     react(),
//   ],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//       "zod/v4/core": "zod", // Redirect zod/v4/core to zod
//     },
//   },
//   server: {
//     port: 3000
//   },
//   build: {
//     chunkSizeWarningLimit: 1000,
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           vendor: ['react', 'react-dom'],
//           crypto: ['@toruslabs/eccrypto']
//         }
//       }
//     },
//     minify: 'esbuild',
//     target: 'es2015'
//   },
//   optimizeDeps: {
//     include: ['@toruslabs/eccrypto']
//   },
//   define: {
//     global: 'globalThis',
//   },
//   resolve: {
//     alias: {
//       crypto: 'crypto-browserify',
//       stream: 'stream-browserify'
//     }
//   }
// });


// export const defineConfi = ({
//   build: {
//     // Reduce chunk size
//     chunkSizeWarningLimit: 1000,
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           vendor: ['react', 'react-dom'],
//           crypto: ['@toruslabs/eccrypto']
//         }
//       }
//     },
//     // Reduce memory usage during build
//     minify: 'esbuild',
//     target: 'es2015'
//   },
//   // Optimize dependencies
//   optimizeDeps: {
//     include: ['@toruslabs/eccrypto']
//   }
// })