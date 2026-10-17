import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  build: {
    outDir: '../dist',
  },
  server: {
    port: 5173,
  },
})