import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';

const COMMIT_HASH = execSync('git rev-parse HEAD').toString().trim();
const COMMIT_DATE = execSync('git log -1 --pretty=format:%cd').toString().trim();

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: [
      '@0b5vr/wavenerd-deck',
    ],
  },
  plugins: [
    react(),
    Icons({ compiler: 'jsx', jsx: 'react' }),
  ],
  define: {
    COMMIT_HASH: `'${COMMIT_HASH}'`,
    COMMIT_DATE: `'${COMMIT_DATE}'`,
  },
  build: {
    target: 'esnext',
  },
  base: './',
});
