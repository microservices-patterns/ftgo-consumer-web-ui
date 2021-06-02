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
 * @param {string} [role]
 * @param {string} [roleSpecifics]
 * @param {string} [personalization]
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
  };
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

export const cssSel = val => {
  return new CssSel(val, null, '');
};

class CssSel {
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
