/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  env: { browser: true, es2021: true, node: true },
  settings: { react: { version: 'detect' } },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: { project: './tsconfig.json' },
    },
    {
      files: ['*.test.*', '*.spec.*'],
      env: { jest: true, 'vitest-globals/env': true },
    },
  ],
}