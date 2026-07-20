import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.ts', 'src/**/__tests__/**/*.test.ts', 'tests/unit/**/*.test.tsx'],
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
