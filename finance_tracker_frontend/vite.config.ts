import { defineConfig } from 'vite';  // ✅ Import this
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Backend API server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // ✅ Fix function syntax
      }
    }
  }
});