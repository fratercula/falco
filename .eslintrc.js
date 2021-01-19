module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
  },
  extends: [
    'airbnb-typescript/base',
  ],
  parserOptions: {
    project: './tsconfig.json',
    createDefaultProgram: true,
  },
  rules: {
    semi: [2, 'never'],
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: false,
        },
        singleline: {
          delimiter: 'comma',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
  },
}
