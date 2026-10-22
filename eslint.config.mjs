import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/node_modules/', '**/dist/'] },
  {
    files: ['**/*.ts'],
    extends: [tseslint.configs.base],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: { '@stylistic': stylistic },
    rules: {
      '@typescript-eslint/no-inferrable-types': 'off',
      '@stylistic/padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: [
            'multiline-block-like',
            'multiline-const',
            'multiline-let',
            'multiline-expression',
          ],
          next: '*',
        },
        { blankLine: 'always', prev: ['interface', 'type'], next: '*' },
        { blankLine: 'any', prev: 'type', next: 'type' },
        {
          blankLine: 'any',
          prev: 'function-overload',
          next: ['function-overload', 'function'],
        },
      ],
    },
  }
);
