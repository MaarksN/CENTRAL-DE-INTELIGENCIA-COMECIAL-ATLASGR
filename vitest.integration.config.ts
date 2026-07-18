import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/helpers/integration-setup.ts'],
    include: ['tests/integration/**/*.test.ts', 'tests/integration/**/*.test.tsx'],
    fileParallelism: false, // Run tests sequentially to avoid DB lock/wipe conflicts
    pool: 'threads',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/main.tsx', 'src/vite-env.d.ts', '**/*.test.ts', '**/*.test.tsx'],
    },
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
});
