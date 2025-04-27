import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp"
    },
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "9676-117-203-246-41.ngrok-free.app",
      "2bda-117-203-246-41.ngrok-free.app",
      "9b33-2404-7c80-3c-2e36-9896-3ccb-5fac-c375.ngrok-free.app",
      "*.ngrok-free.app", // Allow all ngrok-generated URLs
      "localhost"
    ],
    cors: true,
  }
})
