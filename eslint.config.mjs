import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [

  js.configs.recommended,

  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {

        project: true,
      },
    },
  },

  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/node_modules/**',
    ],
  },
]