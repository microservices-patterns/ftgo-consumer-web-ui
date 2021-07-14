export const FOR_TESTS = 'test';
export const FOR_RENDER = 'render';
export const FOR_TEST_SVG = 'testSvg';
export const FOR_RENDER_SVG = 'renderSvg';

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
 * @param {...string} args
 * @return {function(string): T}
 */
export function prepareTestId(...args) {
  return fn => fn(produceTestIdAttrValue(args));
}

/**
 *
 * @param {...string} args
 * @return {function(function(string):P): function(...string): P}
 */
export function prepareTestIdOpen(...args) {
  return fn => (...args2) => {
    return fn(produceTestIdAttrValue([ ...args, ...args2 ]));
  };
}

/**
 *
 * @param {Array<?string|?number>} args
 * @return {string|''}
 */
function produceTestIdAttrValue(args) {
  const selector = pickHeadUntilNullish(args).map(String).join('|');
  return selector ? selector + '|' : selector;
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

const implMap = {
  [ FOR_TESTS ]: e2eSelector,
  [ FOR_RENDER ]: e2eAttr,
  [ FOR_TEST_SVG ]: null,
  [ FOR_RENDER_SVG ]: null
};

/**
 *
 * @param {function(function(...string): function(arg:string): T, ?function(...string):function(function(string):P): function(...string): P):} cb
 * @return {function('test'|'render'): Object<string, T|P>|T|P}
 */
export const defineTestIdDictionary =
  cb =>
    testOrRuntime => {
      const cbResult = cb(prepareTestId, prepareTestIdOpen);
      const impl = implMap[ testOrRuntime ] || (K => K);
      return (typeof cbResult === 'function') ? cbResult(impl) : applyForEachPair(cbResult, impl);
    };


export const cssSel = val => {
  return new CssSel(val, null, '');
};

export class CssSel {
  /**
   *
   * @param val
   * @param {CssSel} [parent]
   * @param {''|' '|'>'|','|' ~ '} [rel='']
   * @param {array} [marks]
   */
  constructor(val, parent = null, rel = '', marks) {
    this._args = [ val, parent, rel, marks ];
    this._marks = marks || (parent ? parent._marks : []) || [];
  }

  store() {
    return new CssSel('', this, '', [ ...this._marks, this ]);
  }

  get(idx) {
    return this._marks[ idx ];
  }

  /**
   * add a selector part for a descendant
   * @param val
   * @return {CssSel}
   */
  desc(val) {
    return new CssSel(val, this, ' ');
  }

  /**
   * add a selector part for an immediate child
   * @param val
   * @return {CssSel}
   */
  child(val) {
    return new CssSel(val, this, '>');
  }

  /**
   * add a modifier for a current selector
   * @param val
   * @return {CssSel}
   */
  mod(val) {
    return new CssSel(val, this, '');
  }

  not(sel) {
    return new CssSel('', this, '').mod(`:not(${ sel })`)
  }

  /**
   *
   * @param { string } attrName
   * @param { string|number } [attrValue]
   * @param { string } [attrCf]
   * @return {CssSel}
   */
  attr(attrName, attrValue, attrCf) {
    if (attrValue == null) {
      return new CssSel(`[${ attrName }]`, this, '');
    }
    if (attrCf == null) {
      return new CssSel(`[${ attrName }="${ String(attrValue).replace('"', '\\"') }"]`, this, '');
    }
    return new CssSel(`[${ attrName }${ attrCf }="${ String(attrValue).replace('"', '\\"') }"]`, this, '');
  }

  or(val) {
    return new CssSel(val, this, ',');
  };

  second() {
    return new CssSel(getValue(this), this, ' ~ ');
  }

  third() {
    const next = this.second();
    return new CssSel(getValue(this), next, ' ~ ');
  }

  toString() {
    return getValue(this);
  }

  valueOf() {
    return getValue(this);
  }
}

function getValue(node) {
  if (!node.effectiveVal) {
    const [ val, parent, rel ] = node._args;
    node.effectiveVal = String(parent || '') + rel + val;
  }
  return node.effectiveVal;
}

/**
 *
 * @param obj { Object<string,function(arg: function(*): T):T>}
 * @param fn { function(*): T}
 * @return {Object<string, T>}
 */
export function applyForEachPair(obj, fn) {
  return Object.fromEntries(
    Array.from(Object.entries(obj || {}),
      ([ k, v ]) => [ k, typeof v === 'function' ? v(fn) : v ]));
}

