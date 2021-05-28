console.log('jest.config.js');
require('./envLoader');
module.exports = {
  verbose: true,
  setupFilesAfterEnv: [ 'jest-extended', './jest.setup.js' ],
//  transformIgnorePatterns: [ 'node_modules/(?!shared-package)' ],
  'reporters': [
    'default',
    [ '<rootDir>/reporters/defaultReporter.js', {
      'jest.config': 'tests-ui/jest.config.js'
    } ]
  ]
};
