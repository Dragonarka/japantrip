import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// Se compila a ../sim para publicarse junto al sitio (GitHub Pages).
// Los datos (../schedule-data.js) se leen en tiempo de ejecución: editar la agenda no requiere recompilar.
const schedule = fileURLToPath(new URL('../schedule-data.js', import.meta.url));

export default defineConfig({
  base: './',
  plugins: [react()],
  define: { __SCHEDULE_DEV_PATH__: JSON.stringify('/@fs' + schedule) },
  server: { fs: { allow: ['..'] } },
  build: { outDir: '../sim', emptyOutDir: true, chunkSizeWarningLimit: 1500 },
});
