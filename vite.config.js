import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'Gantt',
      formats: ['es', 'umd', 'cjs'],
      fileName: (format) => {
        if (format === 'cjs') return 'index.js';
        return `gantt.${format}.js`;
      },
    },
    rollupOptions: {
      output: {
        assetFileNames: 'gantt[extname]',
        interop: 'auto',
      }
    },
  },
  server: {
    watch: {
      include: ['dist/**', 'src/**'],
    },
  },
});
