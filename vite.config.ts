import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 5175, // Changed from 5174 to 5175
  },
  build: {
    sourcemap: true,
  },
});