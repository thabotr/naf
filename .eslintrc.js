module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'codingitwrong',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['detox', 'jest'],
  env: {'detox/detox': true, 'jest/globals': true},
  rules: {'object-curly-spacing': 'off'},
};
