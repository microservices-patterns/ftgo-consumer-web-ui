export function tagPageObject(name, obj) {
  return tagAllFunctionalPairs(obj, name, controlledExecution);
}

function tagAllFunctionalPairs(object, name, cb) {
  return Object.fromEntries(Array.from(Object.entries(object),
    ([ key, value ]) => [ key, (...args) => cb(key, value, args, name) ]));
}

function controlledExecution(key, fn, args, name) {
  if (typeof fn !== 'function') {
    return fn;
  }
  const executionName = [ name, key ].filter(Boolean).join('-');
  console.log(`Executing [${ executionName }]`);
  try {
    const result = fn(...args);
    if (result instanceof Promise) {
      result.then(() => {
        console.log(`Resolved [${ executionName }]`);
      }, () => {
        console.log(`Rejected [${ executionName }]`);
      });
    } else {
      console.log(`Finished [${ executionName }]`);
    }
    return result;
  } catch (ex) {
    console.log(`Caught in [${ executionName }]`);
    throw ex;
  }
}
