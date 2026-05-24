import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@workspace/ui': path.resolve(__dirname, '../libs/ui/src'),
      '@workspace/hooks': path.resolve(__dirname, '../libs/hooks/src'),
      '@workspace/i18n': path.resolve(__dirname, '../libs/i18n/src'),
      // Force single React instance from my-app node_modules
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react-i18next': path.resolve(__dirname, 'node_modules/react-i18next'),
    },
    dedupe: ['react', 'react-dom', 'react-i18next'],
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
  },
})
