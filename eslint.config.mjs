import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import stylistic from '@stylistic/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      '**/dist/**/*',
    ],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  stylistic.configs.customize({
    semi: true,
    braceStyle: '1tbs',
    arrowParens: true,
    quoteProps: 'consistent',
  }),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@stylistic/max-statements-per-line': ['error', { max: 2 }],
    },
  },
];
