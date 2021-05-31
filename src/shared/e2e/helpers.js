/**
 *
 * @param arr {Array<string|empty>}
 * @return Array<string>
 */
export function pickHeadUntilNullish(arr) {
  return arr.reduce((memo, arg, idx) =>
    ((idx === memo.length) ?
      ((arg == null) ? memo : memo.concat([ arg ])) :
      memo), []);
}

/**
 *
 * @param role? {string}
 * @param roleSpecifics? {string}
 * @param personalization? {string}
 * @return {function(arg:string): *}
 */
export function prepareSelector(role, roleSpecifics, personalization) {
  const selector = pickHeadUntilNullish([ role, roleSpecifics, personalization ]).join('|');

  return fn => fn(selector ? selector + '|' : selector);
}

/**
 *
 * @param args
 * @return {function(*): function(...[*]): *}
 */
export function prepareSelectorOpen(...args) {
  return fn => (...args2) => {
    const selector = pickHeadUntilNullish([ ...args, ...args2 ]).join('|');
    return fn(selector ? selector + '|' : selector);
  }
}

/**
 *
 * @param sel {string}
 * @return {{'data-testid'}}
 */
export function e2eAttr(sel) {
  return ({ 'data-testid': sel });
}

/**
 *
 * @param sel {string}
 * @return {string}
 */
export function e2eSelector(sel) {
  if (sel) {
    return `[data-testid^="${ sel }"]`;
  }
  return '[data-testid=""]';
}
