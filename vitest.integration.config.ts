import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    // Do NOT load setup.ts here, because setup.ts contains the global Prisma mock.
    setupFiles: ['./tests/helpers/integration-setup.ts'],
    include: ['tests/integration/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      reportsDirectory: './coverage/integration',
      include: ['src/features/**/services/*.ts', 'src/lib/prisma.ts'],
      thresholds: {
        statements: 95,
        functions: 95,
        lines: 95,
        branches: 90
      }
    },
  },
});
