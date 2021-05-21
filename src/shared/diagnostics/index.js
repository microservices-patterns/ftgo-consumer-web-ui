/**
 *
 * @returns {{error:Function, debug:Function}}
 */

//export const getLogger = () => {
  //  return [ 'log', 'warn', 'info', 'debug', 'error' ].reduce((obj, lvl) =>
  //    Object.assign(obj, { [ lvl ]: (...args) =>
  //        console[ lvl ](...args) }), {});
  //};

const logger = console;

export const logged = (...args) => {
  const [ fn, str, ...restArgs ] = args;
  if (fn instanceof Function) {
    return (...args) => {
      const [ arg0, ...rest ] = args;
      if (arg0 instanceof Error) {
        str ? logger.error(str, ...args) : logger.error(...args);
      } else {
        const arg00 = (typeof arg0 === 'object') ? JSON.stringify(arg0) : arg0;
        str ? logger.debug(str, arg00, ...rest) : logger.debug(arg00, ...rest);
      }
      return fn(...args);
    };
  }
  const arg0 = fn;
  if (arg0 instanceof Error) {
    (typeof str === 'string') ? logger.error(str, arg0, ...restArgs) : logger.error(arg0, str, ...restArgs);
  } else {
    const arg00 = (typeof arg0 === 'object') ? JSON.stringify(arg0, getCircularRefsResolver()) : arg0;
    (typeof str === 'string') ? logger.debug(str, arg00, ...restArgs) : logger.debug(arg00, str, ...restArgs);
  }
  return arg0;
};

function getCircularRefsResolver() {
  const cache = new Set();

  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      // Duplicate reference found, discard key
      if (cache.has(value)) return;

      // Store value in our collection
      cache.add(value);
    }
    return value;
  };
}


/**
 *
 * @param arg
 * @return {(function(...[*]): (*|undefined))|*}
 */
export function debugged(arg) {
  if (typeof arg === 'function') {
    return (...args) => {
      try {
        const result = arg(...args);

        // result of the function execution (success)
        console.log(...args);
        console.log(result);
        debugger;

        return result;
      } catch (ex) {

        // result of the function execution (failure)
        console.log(...args);
        console.error(ex);
        debugger;

        throw ex;
      }
    };
  }

  // inspected non-callable argument
  console.log(arg);
  debugger;

  return arg;
}
