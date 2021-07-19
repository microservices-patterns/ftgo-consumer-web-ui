export function forTimeout(ms, result) {
  return result ?
    ((typeof result === 'function') ?
      new Promise((rs, rj) => setTimeout(() => result(rs, rj), ms)) :
      new Promise(rs => setTimeout(() => rs(result), ms))) :
    new Promise(rs => setTimeout(rs, ms));
}

const MSEC_IN_SEC = 1000;
const MSEC_IN_MIN = MSEC_IN_SEC * 60;
Object.assign(forTimeout, {
  SEC: MSEC_IN_SEC,
  MIN: MSEC_IN_MIN
});

/**
 *
 * @param promise
 * @returns {Promise<*[]|*[]>}
 */
export async function safelyExecuteAsync(promise) {
  try {
    return [ null, await promise ];
  } catch (ex) {
    return [ ex ];
  }
}

/**
 *
 * @param asyncFn
 * @returns {(function(...[*]): Promise<[null, *]|[*]|undefined>)|*}
 */
export function makeSafelyRunAsyncFn(asyncFn) {
  return async (...args) => {
    try {
      return [ null, await asyncFn(...args) ];
    } catch (ex) {
      return [ ex ];
    }
  }
}

export function safelyExecuteSync(fn) {
  return (...args) => {
    try {
      return [ null, fn(...args) ];
    } catch (ex) {
      return [ ex ];
    }
  };

}

export function stubAsync(promise) {
  promise.then(() => void 0, () => void 0);
  return promise;
}

/**
 * Prevents another async call if the previous is not fulfilled
 * @param asyncFn
 * @return {function(...[*]): null}
 */
export function blockedAsync(asyncFn) {
  const ctx = { current: null };
  let count = 0;

  function cleanup() {
    ctx.current = null;
  }

  return (...args) => {
    if (!ctx.current) {
      ctx.current = asyncFn(...args);
      ctx.current.then(cleanup, cleanup);
    } else {
      console.log('blockedAsync blocked', count++);
    }
    return ctx.current;
  };
}

export function ExposedPromise() {
  const ctx = this;
  return Object.assign(new Promise((resolve, reject) => {
    Object.assign(ctx, { resolve, reject });
  }), ctx);
}
