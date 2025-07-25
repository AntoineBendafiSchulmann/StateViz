import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,

    setupFiles: [],

    coverage: {
      reporter: ['text', 'html'],

      // fichiers à analyser
      include: [
        'apps/frontend/src/**/*.{ts,tsx}',
        'packages/core/src/**/*.ts'
      ],
      // ignore les qui atteignent 100% de couverture (pour les tests) pour clarifier le rapport
      skipFull: true,

      // fichiers ignorés
      exclude: [
        '**/__tests__/**',
        '**/*.d.ts',
        '**/dist/**',
        'apps/**/tailwind.config.js',
        'apps/**/postcss.config.*'
      ],
    },
  },
})