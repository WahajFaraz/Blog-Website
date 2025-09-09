import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api/v1': {
        target: 'https://blog-website-rouge-nine.vercel.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/v1/, '')
      },
    },
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
      mode === 'production' 
        ? 'https://blog-website-rouge-nine.vercel.app/api/v1'
        : '/api/v1'
    )
  },
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}));
