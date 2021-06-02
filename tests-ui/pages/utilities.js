const consoleOverload = [ 'log', 'group', 'groupEnd', 'warn', 'error', 'info', 'debug' ].reduce((memo, method) =>
  Object.assign(memo, {
    [ method ]: function (...args) {
      console[ method ] && console[ method ](...args);
      if (this._messages) {
        this._messages.push({
          timestamp: new Date().getTime(),
          method,
          args
        });
      }
    }
  }), {
  _messages: [],
  flush() {
    if (this._messages) {
      const result = Array.from(this._messages);
      this._messages = [];
      return result;
    }
  },
  restore() {
    return console;
  }
});

/**
 *
 * @param { string } name
 * @param { Object<string,function>} obj
 * @return { Object<string,function> }
 */
export function tagPageObject(name, obj) {
  return tagAllFunctionalPairs(obj, createLoggedControlledExecution(consoleOverload), name);
}

/**
 *
 * @param { Object<string,function> } object
 * @param {function} cb
 * @param extraArgs
 * @return { Object<string,function> }
 */
function tagAllFunctionalPairs(object, cb, ...extraArgs) {
  return Object.fromEntries(Array.from(Object.entries(object),
    ([ key, value ]) => [ key, (...args) => cb(key, value, args, ...extraArgs) ]));
}

export function summarizePageObject(useOriginalConsole) {
  if (!('flush' in consoleOverload)) {
    return;
  }
  const messages = consoleOverload.flush();
  if (useOriginalConsole) {
    messages.forEach(({ method, args }) => console[ method ](...args));
  } else {
    console.log(messages);
  }
}

function createLoggedControlledExecution(console) {

  /**
   *
   * @param key
   * @param fn
   * @param args
   * @param name
   * @return {*}
   */
  return function controlledExecution(key, fn, args, name = 'Unmarked object') {
    if (typeof fn !== 'function') {
      return fn;
    }
    const executionName = [ name, key ].filter(Boolean).map(camelCaseToSentenceCase).join(': ');
    console.group && console.group();
    console.log(`[${ executionName }] Executing`);
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        result.then(() => {
          console.log(`[${ executionName }] Resolved`);
          console.groupEnd && console.groupEnd();
        }, () => {
          console.log(`[${ executionName }] Rejected`);
          console.groupEnd && console.groupEnd();
        });
      } else {
        console.log(`[${ executionName }] Finished`);
        console.groupEnd && console.groupEnd();
      }
      return result;
    } catch (ex) {
      console.log(`[${ executionName }] Threw`);
      console.groupEnd && console.groupEnd();
      throw ex;
    }
  };
}

/**
 *
 * @param {string} text
 * @return {string}
 */
function camelCaseToSentenceCase(text) {
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}
