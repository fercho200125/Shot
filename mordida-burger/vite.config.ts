import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Rutas relativas: el build funciona en cualquier carpeta o subdominio.
  base: './',
  plugins: [react()],
});
