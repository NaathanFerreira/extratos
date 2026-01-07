import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Importante para GitHub Pages: base = '/<nome-do-repo>/'
export default defineConfig({
  plugins: [react()],
  base: '/extratos/',
  publicDir: 'public',
})
