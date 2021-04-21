import { ExposedPromise, safelyExecuteAsync } from './index';

describe(`shared/promises/index.js`, () => {
  describe(`safelyExecuteAsync(promise)`, () => {

    test(`Wraps rejected promise in the error part of a promised tuple: Promise<[error result]>`, async () => {
      const anAsyncFunctionThatRejects = async () => {
        throw new Error('Rejected promise');
      };
      const result = await safelyExecuteAsync(anAsyncFunctionThatRejects());
      expect(result).toEqual([ new Error('Rejected promise') ]);
    });

    test(`Wraps resolved promise in the result part of a promised tuple: Promise<[error result]>`, async () => {
      const anAsyncFunctionThatResolved = async () => {
        return 'Resolved promise';
      };
      const result = await safelyExecuteAsync(anAsyncFunctionThatResolved());
      expect(result).toEqual([ null, 'Resolved promise' ]);
    });
  });

  describe(`ExposedPromise`, () => {
    test(`ExposedPromise.then`, async () => {
      const subject = new ExposedPromise();
      expect(subject.then).toBeDefined();
    });
    test(`ExposedPromise.resolve`, async () => {
      const subject = new ExposedPromise();
      const expectedValue = 1234;
      setTimeout(() => {
        subject.resolve(expectedValue);
      }, 700);

      const actualValue = await subject;

      expect(actualValue).toEqual(expectedValue);
    });

    test(`ExposedPromise.reject`, async () => {
      const subject = new ExposedPromise();
      const expectedValue = 'thrown error';
      setTimeout(() => {
        subject.reject(expectedValue);
      }, 700);

      let actualValue = null;
      try {
        actualValue = await subject;
      } catch (ex) {
        actualValue = ex;
      }

      expect(actualValue).toEqual(expectedValue);
    });
  });

});