import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@databridger/react-client": path.resolve(__dirname, "../../../packages/react-client/src"),
      "@databridger/client": path.resolve(__dirname, "../../../packages/client/src"),
    },
  },
})
