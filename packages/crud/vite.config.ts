// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
  build: {
    lib: {
      name: 'nest-crud-server',
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['nest-crud-client'],
    },
  },
  plugins: [dts({ rollupTypes: true }), tsconfigPaths()],
});
