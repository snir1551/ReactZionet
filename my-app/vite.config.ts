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
    },
  },
})
