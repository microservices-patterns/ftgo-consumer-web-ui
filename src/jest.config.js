console.log('Jest Config Loaded: maa-client/src/jest.config.js');
console.log('JEST_JUNIT_OUTPUT_DIR=', process.env.JEST_JUNIT_OUTPUT_DIR);

module.exports = {
  setupFilesAfterEnv: [
    './setupTests.js',
    '<rootDir>/window.setup.js'
  ],
  moduleNameMapper:{
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js"
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-syntax-highlighter/dist/esm)|(reactstrap/es)|(@babel/runtime/helpers/esm))',
  ]
};
