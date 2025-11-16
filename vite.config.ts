// Vite configuration file for the Teacher & Student Portal application
// Configures the build tool for React development with TypeScript support

import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Export the Vite configuration
export default defineConfig({
  // React plugin for JSX/TSX support
  plugins: [react()],

  // Development server configuration
  server: {
    port: 3000,        // Development server port
    host: '0.0.0.0',   // Allow external connections (useful for testing)
  },

  // Path resolution configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'), // Alias for project root
    }
  }
});
