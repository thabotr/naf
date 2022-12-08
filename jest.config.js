module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!((jest-)?react-native(-iphone-x-helper|-paper)?|@react-native(-community)?)/)',
  ],
  verbose: true,
  setupFiles: ['<rootDir>/__tests__/jest-setup.js'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};
