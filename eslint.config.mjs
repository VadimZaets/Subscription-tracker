// Flat config (ESLint 10+). SETUP_HOOKS.md описує .eslintrc.cjs (legacy) —
// цей файл переносить ті самі правила у флет-формат.
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactNativePlugin from 'eslint-plugin-react-native';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sonarjs from 'eslint-plugin-sonarjs';

export default [
  js.configs.recommended,
  {
    ignores: [
      '**/node_modules/**',
      '**/ios/**',
      '**/android/**',
      '**/.expo/**',
      '**/docs/**',
      '**/dist/**',
      '**/build/**',
    ],
  },
  {
    files: ['*.config.{js,mjs,cjs}', 'babel.config.js', 'metro.config.js'],
    languageOptions: {
      globals: { module: 'writable', require: 'readonly', __dirname: 'readonly', process: 'readonly' },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' },
      globals: { __dirname: 'readonly', require: 'readonly', module: 'readonly' },
    },
    // 'detect' змушує eslint-plugin-react прощупувати react-native (Flow-синтаксис)
    // нашим TS-парсером і сипати хибними "Error while parsing" — фіксуємо версію напряму.
    settings: { react: { version: '19.2' } },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-native': reactNativePlugin,
      'simple-import-sort': simpleImportSort,
      sonarjs,
    },
    rules: {
      // STYLEGUIDE.md §1, §2, §4, §5, §8
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      'react/function-component-definition': [
        'warn',
        { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-native/no-color-literals': 'warn',
      'react-native/no-inline-styles': 'warn',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'import/no-duplicates': 'warn',
      'import/no-cycle': 'warn',
      // SETUP_HOOKS.md — sonarjs
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/no-duplicate-string': ['warn', { threshold: 5 }],
      'sonarjs/cognitive-complexity': ['warn', 15],
      'sonarjs/no-collapsible-if': 'warn',
      'sonarjs/no-identical-expressions': 'warn',
      'sonarjs/no-redundant-boolean': 'warn',
      'sonarjs/prefer-immediate-return': 'warn',
      'sonarjs/no-gratuitous-expressions': 'warn',
      // TS вже ловить недекларовані імена — вимикаємо базове правило JS,
      // яке інакше лається на React/типи в JSX-скоупі.
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    // STYLEGUIDE.md §1: без default export — але тільки для перевикористовуваних
    // примітивів. Роути в app/ використовують default export за вимогою expo-router.
    files: ['src/components/**/*.{ts,tsx}', 'src/screens/**/*.{ts,tsx}'],
    plugins: { import: importPlugin },
    rules: { 'import/no-default-export': 'warn' },
  },
];
