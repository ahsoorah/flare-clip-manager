import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/r2-clips': {
        target: 'https://clips.yourdomain.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/r2-clips/, '')
      }
    }
  }
})
