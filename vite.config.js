import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5010,
  },
  define: {
    'process.env': process.env
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});