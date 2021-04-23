import { processFormSubmissionError } from './submissionHandling';

describe(`src/shared/forms/submissionHandling.js`, () => {

  describe(`processFormSubmissionError(effectiveError, setError, clearErrors)`, () => {

    const setError = jest.fn();
    const clearErrors = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    test(`falsy effectiveError makes clearErrors called`, () => {
      processFormSubmissionError(undefined, setError, clearErrors);
      expect(clearErrors).toHaveBeenCalled();
      expect(setError).not.toHaveBeenCalled();
    });

    test(`truthy error with a message - supplied message form error`, () => {
      processFormSubmissionError({ message: 'Single error message' }, setError, clearErrors);
      expect(clearErrors).not.toHaveBeenCalled();
      expect(setError).toHaveBeenCalled();
      expect(setError).toHaveBeenCalledTimes(1);
    });

    test(`truthy error with no message - default form error`, () => {
      processFormSubmissionError({ _no_message_prop: true }, setError, clearErrors);
      expect(clearErrors).not.toHaveBeenCalled();
      expect(setError).toHaveBeenCalled();
      expect(setError).toHaveBeenCalledTimes(1);
    });

    test(`truthy error with messages for several props - by-fields errors`, () => {
      processFormSubmissionError({
        errors: {
          foo: 'error1', bar: 'error2'
        }
      }, setError, clearErrors);
      expect(clearErrors).not.toHaveBeenCalled();
      expect(setError).toHaveBeenCalled();
      expect(setError).toHaveBeenCalledTimes(2);
      expect(setError).toHaveBeenNthCalledWith(1, 'foo',{ message:  'error1', type: 'server'});
      expect(setError).toHaveBeenNthCalledWith(2, 'bar', { message:  'error2', type: 'server'});
    });

  });
});
