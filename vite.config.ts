import path from 'path';
import { readFileSync } from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    // Vercel 環境用 '/'，GitHub Pages 用 '/MD2DOC-Evolution/'
    const isVercel = process.env.VERCEL === '1';
    return {
      base: isVercel ? '/' : '/MD2DOC-Evolution/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        __APP_VERSION__: JSON.stringify(packageJson.version),
      },
      build: {
        chunkSizeWarningLimit: 1000, // 提高警告門檻至 1MB
        rollupOptions: {
          output: {
            manualChunks: {
              docx: ['docx'],
              vendor: ['react', 'react-dom', 'lucide-react', 'file-saver'],
            },
          },
        },
      },
    };
});
