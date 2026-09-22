import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { defineConfig } from 'vite';
export default defineConfig({
  root: 'demos/nvrmind',
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@nvr': fileURLToPath(new URL('./demos/nvrmind', import.meta.url)),
    },
    dedupe: ['react', 'react-dom'],
  },
  css: { postcss: { plugins: [tailwindcss()] } },
  build: { outDir: '../../public/projetos/nvrmind', emptyOutDir: true },
});
