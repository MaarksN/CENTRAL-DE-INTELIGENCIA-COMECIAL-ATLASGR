import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/helpers/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      reportsDirectory: './coverage/unit',
      include: ['src/**/*.{ts,tsx}', 'server/**/*.ts'],
      exclude: [
        'server/**/*.d.ts',
        'server.ts',
        '**/*.config.{ts,js,mjs}',
      ],
      thresholds: {
        statements: 95,
        functions: 95,
        lines: 95,
        branches: 90
      }
    },
  },
});
