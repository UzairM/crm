module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'linebreak-style': ['error', 'windows'],
    'semi': ['error', 'always'],
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'no-console': 'off',
    'no-undef': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn'
  },
  env: {
    'node': true,
    'es2022': true
  }
};
