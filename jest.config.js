module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!((jest-)?react-native(-iphone-x-helper|-paper)?' +
      '|@react-native(-community)?|rn-fetch-blob)|react-native-vector-icons/)',
  ],
  verbose: true,
  setupFiles: ['<rootDir>/__tests__/unit/jest-setup.js'],
  testMatch: ['<rootDir>/__tests__/unit(/**)*/*.(spec|test).tsx'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
