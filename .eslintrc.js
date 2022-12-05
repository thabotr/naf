module.exports = {
  root: true,
  extends: ['@react-native-community', 'codingitwrong'],
  parser: 'babel-eslint',
  plugins: ['detox', 'jest'],
  env: {'detox/detox': true, 'jest/globals': true},
  rules: {'object-curly-spacing': 'off'},
};
