import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './') },
      { find: '@/', replacement: path.resolve(__dirname, './') },
    ],
  },
  server: {
    port: 3000,
    open: true,
    // Enable polling for file watch on environments where native fs events fail (Windows, WSL, Docker)
    watch: {
      usePolling: true,
    },
    // Explicit HMR client options to avoid websocket connection issues
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
      clientPort: 3000,
    },
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
