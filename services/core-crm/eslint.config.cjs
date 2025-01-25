const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      globals: {
        node: true,
        es2022: true,
        process: true,
        console: true,
        require: true,
        __dirname: true,
        module: true,
        exports: true
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      'linebreak-style': ['error', 'windows'],
      'semi': ['error', 'always'],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'no-console': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
];
