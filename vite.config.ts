import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': '.'
    }
  },
  server: {
    host: true,
    port: 5173
  }
});
