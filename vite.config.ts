import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'framer-motion'],
  },
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2, // Multiple passes for better compression
      },
      mangle: {
        safari10: true, // Fix Safari 10 issues
      },
    },
    // Optimize chunk size
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        museum: resolve(__dirname, 'museum3d.html'),
        tech: resolve(__dirname, 'tech3d.html'),
      },
      output: {
        // Better code splitting for mobile
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'framer-motion': ['framer-motion'],
          'react-vendor': ['react', 'react-dom'],
          'ui-components': [
            './src/components/Navigation.tsx',
            './src/components/ChatBot.tsx',
          ],
        },
        // Optimize asset file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Reduce chunk size for mobile
    chunkSizeWarningLimit: 600,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Minify CSS
    cssMinify: true,
    // Source maps for production debugging (disable for smaller builds)
    sourcemap: false,
    // Target modern browsers for smaller bundles
    target: 'es2015',
    // Optimize asset inlining
    assetsInlineLimit: 4096, // 4kb
    // Improve mobile loading
    modulePreload: {
      polyfill: true,
    },
  },
  // Performance optimizations
  server: {
    // Enable HMR
    hmr: true,
    // Optimize dev server
    watch: {
      usePolling: false,
    },
  },
  // CSS optimization
  css: {
    devSourcemap: false,
  },
});
