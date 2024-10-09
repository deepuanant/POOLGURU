import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path-browserify';

// Use process.env.PORT to bind to the correct port during deployment
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.JPG", "**/*.xlsx"],

  server: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
  },

  optimizeDeps: {
    include: ["jwt-decode"], // remove "some-commonjs-library"
    exclude: ["chunk-WI5KQTCY", "chunk-LK32TJAX"], // Exclude the problematic chunks
  },

  resolve: {
    alias: {
      // Add polyfills for Node.js modules
      'path': 'path-browserify',
      'source-map-js': 'source-map',
      'url': 'url-polyfill',
      // Exclude `fs` from the build
      'fs': 'path-browserify' // Alias `fs` to `path-browserify` to avoid errors
    }
  }
});
