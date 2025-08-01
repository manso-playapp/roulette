import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Optimizaciones para reducir el tamaño de peticiones
  server: {
    hmr: {
      // Reducir la frecuencia de HMR para evitar bucles infinitos
      overlay: false, // Desactivar overlay de errores en pantalla
    },
    // Limitar el tamaño de las peticiones
    middlewareMode: false,
  },
  
  // Optimizar el build para reducir el tamaño
  build: {
    // Dividir en chunks más pequeños
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar Firebase en su propio chunk
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Separar React en su propio chunk
          react: ['react', 'react-dom'],
          // Separar router en su propio chunk
          router: ['react-router-dom'],
        }
      }
    },
    // Reducir el límite de advertencia de chunk
    chunkSizeWarningLimit: 1000,
  },
  
  // Optimizar dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
  },
})
