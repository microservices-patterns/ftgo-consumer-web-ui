const { extendWithLocal } = require('./utilities');

console.log('hooksDefaultReporter.js');

class HooksDefaultReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }
  onRunStart(results, options) {
    console.debug('HooksDefaultReporter: (onRunStart):');
  }
  onTestFileStart(test) {
    console.debug('HooksDefaultReporter: (onTestFileStart):', test.path);
  }
  onTestStart(test) {
    console.debug('HooksDefaultReporter: (onTestStart):', test);
  }
  onTestResult(test) {
    console.debug('HooksDefaultReporter: (onTestResult):', test.path);
  }
  onTestFileResult(test, testResult, aggregatedResult) {
    console.debug('HooksDefaultReporter: (onTestFileResult):', test.path);
  }
  onTestCaseResult(test, testCaseResult) {
    console.debug('HooksDefaultReporter: (onTestCaseResult):', test.path);
  }
  onRunComplete(contexts, results) {
    console.debug('HooksDefaultReporter: (onRunComplete):');
//    console.debug('GlobalConfig: ', this._globalConfig);
//    console.debug('Options: ', this._options);
  }
  getLastError() {
    if (this._shouldFail) {
      return new Error('HooksDefaultReporter reported an error');
    }
  }
}

module.exports = extendWithLocal(HooksDefaultReporter, './localizedHooksReporter.local.js');
