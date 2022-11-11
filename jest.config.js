//module.exports = {
//  preset: 'react-native',
//  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
//};
// module.exports = {
//   transform: {'^.+\\.ts?$': 'ts-jest'},
//   testEnvironment: 'node',
//   testRegex: '/__tests__/.*\\.(test|spec)?\\.(ts|tsx)$',
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
// };
// module.exports = {
//   preset: 'ts-jest',
//   transform: {
//     '^.+\\.(ts|tsx)?$': 'ts-jest',
//     "^.+\\.(js|jsx)$": "babel-jest",
//   }
// };
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};