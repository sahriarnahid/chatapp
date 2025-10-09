import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/chatapp/', // <--- required for GitHub Pages
  plugins: [react()],
})

