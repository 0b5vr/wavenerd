import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig( {
  plugins: [
    react(),
    Icons( { compiler: 'jsx', jsx: 'react' } ),
  ],
  base: './',
} );
