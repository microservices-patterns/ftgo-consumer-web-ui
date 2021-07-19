// eslint-disable-next-line no-redeclare
/* global describe, expect, test */

import { blockedAsync, ExposedPromise, forTimeout, makeSafelyRunAsyncFn, safelyExecuteAsync, stubAsync } from './index';

describe(`shared/promises/index.js`, () => {

  describe(`forTimeout()`, () => {

    const thenResult = jest.fn();

    beforeAll(() => {
      jest.useFakeTimers();
    });
    afterAll(() => {
      jest.useRealTimers();
    });
    beforeEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    test(`forTimeout.SEC constant`, () => {
      expect(forTimeout.SEC).toEqual(1000);
    });

    test(`forTimeout.MIN constant`, () => {
      expect(forTimeout.MIN).toEqual(60 * 1000);
      expect(forTimeout.MIN).toEqual(60 * forTimeout.SEC);
    });

    test(`forTimeout(ms)`, async () => {
      const result = forTimeout(forTimeout.MIN).then(thenResult);
      expect(thenResult).not.toHaveBeenCalled();
      jest.advanceTimersByTime(60 * 1000 + 100);
      try {
        await result;
      } catch {}
      expect(thenResult).toHaveBeenCalled();
    });

    test(`forTimeout(ms, resolveValueAsObject)`, async () => {
      const resolveValueAsObject = { uniqueObject: true };
      const result = forTimeout(forTimeout.MIN, resolveValueAsObject);
      result.then(thenResult);
      expect(thenResult).not.toHaveBeenCalled();
      jest.advanceTimersByTime(60 * 1000 + 100);
      try {
        await result;
      } catch {}
      expect(thenResult).toHaveBeenCalledWith(resolveValueAsObject);
      //noinspection ES6MissingAwait
      expect(result).resolves.toEqual(resolveValueAsObject);
    });

    test(`forTimeout(ms, resultAsTransformFnSuccess)`, async () => {
      const resultAsTransformFnSuccess = jest.fn(rs => rs(42));
      const result = forTimeout(forTimeout.MIN, resultAsTransformFnSuccess);
      result.then(thenResult);
      expect(thenResult).not.toHaveBeenCalled();
      expect(resultAsTransformFnSuccess).not.toHaveBeenCalled();
      jest.advanceTimersByTime(60 * 1000 + 100);
      try {
        await result;
      } catch {}
      expect(resultAsTransformFnSuccess).toHaveBeenCalled();
      expect(thenResult).toHaveBeenCalledWith(42);
      //noinspection ES6MissingAwait
      expect(result).resolves.toEqual(42);
    });

    test(`forTimeout(ms, resultAsTransformFnFailure)`, async () => {
      const resultAsTransformFnFailure = jest.fn((_, rj) => rj(42));
      const rejectFn = jest.fn();
      const result = forTimeout(forTimeout.MIN, resultAsTransformFnFailure);
      result.then(thenResult, rejectFn);
      expect(thenResult).not.toHaveBeenCalled();
      expect(rejectFn).not.toHaveBeenCalled();
      expect(resultAsTransformFnFailure).not.toHaveBeenCalled();
      jest.advanceTimersByTime(60 * 1000 + 100);
      try {
        await result;
      } catch {}
      expect(thenResult).not.toHaveBeenCalled();
      expect(rejectFn).toHaveBeenCalled();
      expect(resultAsTransformFnFailure).toHaveBeenCalled();

      expect(rejectFn).toHaveBeenCalledWith(42);
      //noinspection ES6MissingAwait
      expect(result).rejects.toEqual(42);

    });
  });

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

  describe(`makeSafelyRunAsyncFn(asyncFn) => async (...args): Promise`, () => {

    test(`Wraps rejecting async fn in the error part of a promised tuple: Promise<[error result]>`, async () => {
      const anAsyncFunctionThatRejects = async () => {
        throw new Error('Rejected promise');
      };
      const result = await makeSafelyRunAsyncFn(anAsyncFunctionThatRejects)();
      expect(result).toEqual([ new Error('Rejected promise') ]);
    });

    test(`Wraps resolved promise in the result part of a promised tuple: Promise<[error result]>`, async () => {
      const anAsyncFunctionThatResolved = async () => {
        return 'Resolved promise';
      };
      const result = await makeSafelyRunAsyncFn(anAsyncFunctionThatResolved)();
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

  describe(`stubAsync(promise)`, () => {

    test(`Stubs then-catch handlers to any promise so that browsers do not complain of a potential unhandled promise`, () => {
      const subject = Promise.reject();
      expect(stubAsync(subject)).toBe(subject);
    });
  });

  describe(`blockedAsync(asyncFn)`, () => {

    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.clearAllTimers();
    });

    test(`Prevents another async call if the previous is not fulfilled`, async () => {
      const subjectFn = jest.fn(arg => forTimeout(forTimeout.MIN, arg));

      const resultFn = blockedAsync(subjectFn);

      expect(subjectFn).not.toHaveBeenCalled();

      const subject1 = resultFn(42);
      const subject2 = resultFn();

      expect(subjectFn).toHaveBeenCalledTimes(1);
      expect(subject2).toBe(subject1);

      jest.advanceTimersByTime(forTimeout.MIN + 100);

      try {
        await subject1;
      } catch {}

      expect(subject1).resolves.toEqual(42);

      const subject3 = resultFn(84);
      const subject4 = resultFn();

      expect(subjectFn).toHaveBeenCalledTimes(2);
      expect(subject3).not.toBe(subject2);
      expect(subject4).toBe(subject3);

      jest.advanceTimersByTime(forTimeout.MIN + 100);

      try {
        await subject1;
      } catch {}

      expect(subject3).resolves.toEqual(84);

    });
  });

});
