import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  base: '/dr-suad-app/',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  },
  // JSX بالـ automatic runtime (لا حاجة لاستيراد React يدوياً)
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
  },
})