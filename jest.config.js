module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!((jest-)?react-native(-iphone-x-helper)?|@react-native(-community)?)/)',
  ],
  verbose: true,
};
