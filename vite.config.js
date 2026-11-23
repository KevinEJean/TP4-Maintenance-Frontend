import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // En développement, toute requête vers /api est redirigée vers le backend Spring Boot.
      // En production (Kubernetes), c'est l'Ingress qui fera ce même routage par chemin.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
