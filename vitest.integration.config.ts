import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/integration/**/*.test.ts'],
    fileParallelism: false,
    poolOptions: {
        threads: {
            singleThread: true
        }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['src/main.tsx', 'src/**/*.d.ts', 'src/components/**', 'src/features/**/*.tsx'],
    },
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    }
  },
});
