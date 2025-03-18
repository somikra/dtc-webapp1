import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: true, // Keep enabled for debugging
    },
  },
  resolve: {
    alias: {
      '@': '/src', // Keep the alias for absolute imports
    },
  },
  optimizeDeps: {
    include: ['@supabase/postgrest-js', '@supabase/supabase-js'], // Pre-bundle these dependencies
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Handle mixed ES/CommonJS modules
    },
  },
});