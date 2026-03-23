import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiProxyTarget = env.VITE_SERVER_URL || `http://localhost:${env.PORT || 4000}`;

  return {
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
      watch: {
        usePolling: true,
      },
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 3000,
        clientPort: 3000,
      },
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return undefined;
            }

            if (id.includes('@monaco-editor')) {
              return 'editor';
            }

            if (id.includes('recharts')) {
              return 'charts';
            }

            if (id.includes('framer-motion')) {
              return 'motion';
            }

            if (id.includes('@clerk')) {
              return 'clerk';
            }

            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('react-router-dom')
            ) {
              return 'react-vendor';
            }

            if (id.includes('lucide-react')) {
              return 'icons';
            }

            return undefined;
          },
        },
      },
    },
  };
});
