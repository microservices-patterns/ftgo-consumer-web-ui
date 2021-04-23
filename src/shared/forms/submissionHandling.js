export function processFormSubmissionError(effectiveError, setError, clearErrors) {
  if (!effectiveError) {
    clearErrors && clearErrors();
    return;
  }
  if (effectiveError.errors) {
    ((Array.isArray(effectiveError.errors) && effectiveError.errors.every(Array.isArray)) ?
      effectiveError.errors :
      Array.from(Object.entries(effectiveError.errors))).forEach(([ key, value ]) =>
      setError(key, { type: 'server', message: value ?? 'Server-side error we cannot explain' }));
  } else {
    setError('form', { type: 'server', message: effectiveError.message ?? 'Server error' });
  }
}
