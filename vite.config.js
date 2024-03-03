import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig( {
  optimizeDeps: {
    exclude: [
      '@0b5vr/wavenerd-deck',
    ],
  },
  plugins: [
    react(),
    Icons( { compiler: 'jsx', jsx: 'react' } ),
  ],
  base: './',
} );
