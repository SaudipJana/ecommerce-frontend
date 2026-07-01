import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [
      'd5c8-2401-4900-889b-da67-d5dd-eace-c50a-16c7.ngrok-free.app'
    ]
  },
  plugins: [react()],
})
