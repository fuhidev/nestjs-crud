// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { VitePluginNode } from 'vite-plugin-node';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
  build: {
    lib: {
      name: 'nest-crud-server',
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'nest-crud-client',
        'class-transformer',
        'class-validator',
        '@nestjs/common',
        'typeorm',
        'wkx',
        'proj4',
      ],
    },
  },
  plugins: [
    VitePluginNode({
      adapter: 'nest',
      appPath: resolve(__dirname, 'src/index.ts'),
      appName: 'nest-crud-server',
    }),
    dts({ rollupTypes: true }),
    tsconfigPaths(),
  ],
  optimizeDeps: {
    // Vite does not work well with optionnal dependencies,
    // mark them as ignored for now
    exclude: [
      '@nestjs/common',
      '@nestjs/core',
      '@nestjs/microservices',
      '@nestjs/websockets',
      'cache-manager',
      'class-transformer',
      'class-validator',
      'fastify-swagger',
    ],
  },
});
