import { DEFAULT_TIMEOUT } from './jest.setup';
import { safelyExecuteAsync } from '../src/shared/promises';

/**
 * @deprecated
 */
const timedAsyncLoop = () => {};

/**
 * @todo implement
 */
const { e2eAriaSelector, e2eDataSelector } = {};

export function waitForE2eSelector(page, ...args) {
  return page.waitForSelector(e2eDataSelector(...args));
}

export function waitForE2eAriaSelector(page, ...args) {
  return page.waitForSelector(e2eAriaSelector(...args));
}

export function waitForE2eSelectorAndClick(page, ...args) {
  return waitForSelectorAndClick(page, e2eDataSelector(...args));
}

export async function waitForFillInTheForm(page, sel, form) {
  for (const [ k, v ] of Object.entries(form)) {
    if (v === true) {
      await waitForSelectorAndClick(page, `${ sel } [name=${ k }]`);
    } else {
      await waitClickAndType(page, `${ sel } [name=${ k }]`, v);
    }
  }
}

export async function waitForVisibleSelector(page, sel, fallback, args) {
  const el = await Promise.race([
    new Promise(rs => setTimeout(() => rs(), 200)), // resolves without value after 200ms
    page.waitForSelector(String(sel), Object.assign({}, args || {}, { visible: true }))
  ]);

  if (el) {
    await page.evaluate(el => el.scrollIntoView(), el);
    return el;
  }

  if (fallback) {
    await fallback(page);
    return waitForVisibleSelector(page, sel, null, args);
  }
  return null;
}

export function waitForSelector(page, sel, ...args) {
  console.log(`waitForSelector(page, '${ sel }')`);
  return page.waitForSelector(String(sel), ...args);
}

export function waitForTimeout(page, msec) {
  console.log(`waitForTimeout(page, ${ msec })`);
  return page.waitForTimeout(msec);
}

export async function waitForSelectorAndClick(page, sel, ...args) {

  console.log(`waitForSelectorAndClick(page, '${ sel }')`);

  const el = await page.waitForSelector(String(sel), args[ 0 ]);

  await page.evaluate(el => el.scrollIntoView(), el);

  const [ err ] = await safelyExecuteAsync(el.click(args[ 1 ]));
  console.log(`waitForSelectorAndClick(page, '${ sel }') - past click()`);

  if (err) {
    console.log(`waitForSelectorAndClick(page, '${ sel }') - caused error: ${ err }. Stack: ${ err.stack }`);
    throw err;
  }

  return el;

}

export async function waitForSelectorAndClickForNewPage(page, sel, ...args) {
  console.log(`waitForSelectorAndClickForNewPage(sel='${ sel }')`);
  const browser = await page.browser();

  const pages = new Set(Array.from(await browser.pages()));

  console.log(`waitForSelectorAndClickForNewPage() - 1`, pages.size);

  await waitForSelectorAndClick(page, sel, ...args);

  await page.waitForTimeout(10000);

  const newPages = Array.from(await browser.pages()).filter(p => !pages.has(p));

  expect(newPages.length).toEqual(1);

  const [ newPage ] = newPages;

  const currentLoc = await newPage.evaluate('location.href');

  console.log(`waitForSelectorAndClickForNewPage() - -3`, currentLoc);

  await newPage.bringToFront();

  await page.waitForTimeout(4000);

  console.log(`waitForSelectorAndClickForNewPage() - exit`);
  return newPage;
}

export function waitClickAndRetype(page, sel, input) {
  return waitClickAndType(page, sel, input, true);
}

export async function waitClickAndType(page, sel, input, replace) {
  await waitForSelector(page, sel);
  replace ? await page.click(String(sel), { clickCount: 3 }) : await page.click(String(sel));
  if (!input) {
    return;
  }
  await page.keyboard.type(Array.from(input), { delay: 20 });
}

export function waitForPathnameLocation(page, pattern, opts = { timeout: 30000 }) {
  return waitForLocation(page, true, pattern, opts);
}

export async function performForLocation(page, pattern, fn) {
  if (pattern.test(await getLocationPathname(page))) {
    return await fn(page);
  }
}

export async function performForEveryOtherLocation(page, pattern, fn) {
  if (!pattern.test(await getLocationPathname(page))) {
    return await fn(page);
  }
}

export async function retryLoop(asyncFn, { failAsyncFn, doWhileFn, retries = 5 } = {}) {
  let result;
  let count = retries ?? 5;
  let err;
  let doRepeat = false;
  do {
    doRepeat = false;
    ([ err, result ] = await safelyExecuteAsync(asyncFn()));
    if (err || (doWhileFn && (doRepeat = doWhileFn(result)))) {
      console.log('[retryLoop]', err || `doWhileFn(${ result }) is truthy, repeating`);
      failAsyncFn && await safelyExecuteAsync(failAsyncFn());
    }
  } while ((err || doRepeat) && (count-- > 0));
  if (err) {
    return [ err ];
  }
  if (doRepeat) {
    return [ new Error('[retryLoop] result validation error'), result ];
  }
  return [ null, result ];
}

export async function waitForLocation(page, isOnlyPathname, pattern, { timeout = DEFAULT_TIMEOUT } = {}) {
  //  const memo = { current: '<UNIDENTIFIED LOCATION>' };

  console.log(`Wait for location: ${ pattern }`);

  const [ err, result ] = await retryLoop(() => (isOnlyPathname ? getLocationPathname(page) : getLocationPathnameAndSearch(page)), {
    doWhileFn: currentLocation => !pattern.test(String(currentLocation)),
    failAsyncFn: () => waitForTimeout(page, 1000)
  });

  if (err) {
    throw new Error(`Failed to navigate to URL with pattern: ${ pattern } within ${ timeout }ms. ${ result ? ` Presently on: ${ result }` : '' }`);
  }
  return result;
}

export async function getLocationPathname(page) {
  return (await evaluateStatement(page, 'window.location.pathname', { neverThrow: true })) ||
    'Indeterminate path, location unavailable';
}

export async function getLocationPathnameAndSearch(page) {
  return (await evaluateStatement(page, 'window.location.href.replace(window.location.origin, "")')) ||
    'Indeterminate path/search, location unavailable';
}

export async function getQuicklyLocationPathnameAndSearch(page) {
  const defaultMsg = 'Indeterminate path/search, location unavailable';
  try {
    return ((await page.mainFrame().evaluate('window.location.href.replace(window.location.origin, "")')) || defaultMsg);
  } catch (_ex) {
    return defaultMsg;
  }
}

async function evaluateStatement(page, statement, opts = {}) {
  const [ err, result ] = await retryLoop(() => page.mainFrame().evaluate(statement), {
    doWhileFn: result => !result || result instanceof Error,
    failAsyncFn: () => waitForTimeout(page, 500),
    retries: 10
  });
  if (err) { return null; }
  return result;
}

export async function waitForSelectorWithText(page, sel, text, { timeout = DEFAULT_TIMEOUT } = {}) {
  if ((typeof text === 'undefined') || (text === 'undefined')) {
    throw new Error(`waitForSelectorWithText: text is undefined. sel=${ sel }`);
  }
  const ctx = {};

  let count = 5;
  let err = null;
  let result = null;
  let tuple = null;
  do {
    ([ err, tuple ] = await safelyExecuteAsync(Promise.all([
      page.$$eval(sel, els => Array.from(els).map(el => el.textContent)),
      page.$$(sel)
    ])));

    if (err || !tuple) {
      err = err || true;
      await waitForTimeout(page, 1000);
      continue;
    }

    {
      const [ allTextMatches, elArray ] = tuple;
      ctx.allTextMatches = allTextMatches;
      const idx = allTextMatches.findIndex(textContent => checkMatch(textContent, text));
      console.log('waitForSelectorWithText: ', idx, allTextMatches);
      if (idx < 0) {
        await waitForTimeout(page, 1000);
        continue;
      }
      return elArray[ idx ];
    }

  } while (err && (count-- >= 0));

  throw new Error(`Failed to locate elements by selector: '${ sel }' and text: '${ text }' within ${ timeout }ms. Resulted text matches: ${ result }`);

}

export async function waitForTextFromSelectorWithText(page, sel, text, { timeout = DEFAULT_TIMEOUT, filterOut } = {}) {
  let count = 5;
  let err = null;
  let result = null;
  do {
    ([ err, result ] = await safelyExecuteAsync(page.$$eval(String(sel), els => Array.from(els).map(el => el.textContent))));
    if (err || !result) {
      err = err || true;
      await waitForTimeout(page, 1000);
      continue;
    }
    console.log(`Immediate result = ${ result }`);
    if (filterOut) {
      result = result.filter(str => (str !== filterOut));
      console.log(`Filtered result (no: '${ filterOut }') = ${ result }`);
    }
    let textMatch = result.find(textContent => checkMatch(textContent, text));
    console.log(`Matched result = ${ textMatch } (matchers: ${ text }`);
    return textMatch;
  } while (err && (count-- >= 0));

  throw new Error(`Failed to locate elements by selector: '${ sel }' and text: '${ text }' within ${ timeout }ms. Resulted text matches: ${ result }`);
}

function checkMatch(input, testText) {
  if (Array.isArray(testText)) {
    return testText.filter(tt => checkMatch(input, tt)).length === testText.length;
  } else if (testText instanceof RegExp) {
    return testText.test(input);
  } else {
    return input.indexOf(testText) >= 0;
  }
}

export async function safeJSONValue(arg) {
  try {
    return await arg.jsonValue();
  } catch (ex) {
    return null;
  }
}

export async function waitForSelectorJustPresent(page, sel, ...args) {
  if (args[ 0 ] && args[ 0 ].waitBefore) {
    await page.waitForTimeout(args[ 0 ].waitBefore);
  }
  return await page.waitForFunction(selector => !!document.querySelector(selector), {}, sel);
}

export async function waitForSelectorNotPresent(page, sel, ...args) {
  if (args[ 0 ]?.waitBefore) {
    await safelyExecuteAsync(page.waitForTimeout(args[ 0 ].waitBefore));
  }
  sel = String(sel);
  console.log(`Attempting to ensure selector '${ sel }' is not present`);
  let err, isNotPresent, count = args[ 0 ]?.retries ?? 5, shouldLoop;
  do {
    ([ err, isNotPresent ] = await safelyExecuteAsync(page.evaluate(selector => !document.querySelector(selector), sel)));
    if (err) {
      console.log(`Attempting to ensure selector '${ sel }' is not present - Failed. Exception: ${ err.message }`);
      throw err;
    }
    shouldLoop = !isNotPresent && (count-- > 0);
    shouldLoop && await safelyExecuteAsync(page.waitForTimeout(500));
  } while (shouldLoop);

  console.log(`Attempting to ensure selector '${ sel }' is not present - Done. Result: ${ isNotPresent }`);
  return isNotPresent;
}

export async function waitForSelectorAndClickProgrammatically(page, sel, ...args) {
  const el = await page.waitForSelector(String(sel), args[ 0 ]);
  await page.evaluate(el => el.scrollIntoView(), el);
  await page.evaluate((el, sel) => (console.log(sel, el, Array.from(Object.keys(el))), el.click()), el, String(sel));
}

function getMeasurementDisplaceForAnchor(pos, start, breadth) {
  switch (pos) {
    case 'top':
    case 'left': {
      return start;
    }

    case 'at_top':
    case 'at_left': {
      return start + (breadth >> 3);
    }

    case 'at_right':
    case 'at_bottom': {
      return start + (breadth >> 1) + (breadth >> 2) + (breadth >> 3);
    }

    case 'bottom':
    case 'right': {
      return start + breadth - 1;
    }

    case 'center':
    default: {
      return start + (breadth >> 1);
    }
  }
}

export async function waitForSelectorAndClickPositionally(page, sel, ...args) {

  console.log(`About to locate and click selector by its position: '${ sel }'`);
  //let count = 0;
  //let ts = new Date().getTime() >> 8;
  //const getPath = () => `${ __dirname }/scr_${ ts }_${ count++ }.png`;
  //let path;

  const el = await page.waitForSelector(String(sel), args[ 0 ]);

  await page.evaluate(el => el.scrollIntoView(), el);

  //path = getPath();
  //await svgEl.screenshot({ path });
  //console.log('svgEl before: ', path);

  const boundingBox = await el.boundingBox();
  if (boundingBox == null) {
    throw new Error(`Selector ${ sel } locates an element which is invisible (or not present)`);
  }

  const { x, y, width, height } = boundingBox;

  const [ vertDisp, horDisp ] = (args[ 2 ] || 'center center').split(/\s+/);

  console.log(`Clicking in the area of ${ x + (width >> 1) }:${ y + (height >> 1) } (x: ${ x }, y: ${ y }, width: ${ width }, height: ${ height })`);
  const radius = args[ 3 ]?.radius || 1;
  const leftCrawl = args[3]?.leftCrawl || false;
  for (const [ diffX, diffY ] of [
    [ 0, 0 ], [ radius, 0 ], [ -radius, 0 ], [ 0, radius ], [ 0, -radius ],
    ...(leftCrawl ? [
      [ -2 * radius, 0 ],
      [ -3 * radius, 0 ],
      [ -4 * radius, 0 ],
      [ -5 * radius, 0 ],
    ] : [])
  ]) {
    const [ currentX, currentY ] = [
      getMeasurementDisplaceForAnchor(horDisp, x, width) + diffX * 2,
      getMeasurementDisplaceForAnchor(vertDisp, y, height) + diffY * 2
    ];
    await page.mouse.move(currentX, currentY);
    await page.mouse.click(currentX, currentY,
      { clickCount: 1, delay: 100, ...(args[ 1 ] || {}) });
  }

  console.log(`Located and clicked selector: '${ sel }'`);


  //path = getPath();
  //await svgEl.screenshot({ path });
  //console.log('svgEl after: ', path);
}

export async function expectElementWithText(page, sel, text) {
  const actualText = await readElementsText(page, sel);
  expect(actualText).toInclude(text); // toEqual(expect.stringMatching(newValue));
  return actualText;
}

export async function expectElementsAttributeToEqual(page, sel, attrName, text) {
  const attrValue = await readElementsAttribute(page, sel, attrName);
  expect(attrValue).toEqual(text); // toEqual(expect.stringMatching(newValue));
}

export async function readElementsAttribute(page, sel, attrName) {
  const el = await page.waitForSelector(String(sel));
  return await page.evaluate((element, attrName) => element.getAttribute(attrName), el, attrName);
}

export async function readInputElementsValue(page, sel) {
  const el = await page.waitForSelector(String(sel));
  return await page.evaluate(element => element.value, el);
}

export async function readElementsText(page, sel) {
  const el = await page.waitForSelector(String(sel));
  return readElementByRefText(page, el);
}

export async function readElementByRefText(page, el) {
  return await page.evaluate(element => element.textContent, el);
}

export async function reloadPage(page) {
  await page.reload({ waitUntil: 'networkidle2' });
  return injectPrompterHelperScript(page);
}

export function injectHelperScripts(page) {
  return Promise.all([
    injectHoverHelperScript(page),
    //    pollingForPersonalModeChange(page)
    //    injectPrompterHelperScript(page)
  ]);
}

/**
 * !Work in Progress
 * @param page
 * @returns {Promise<void>|Promise<any>}
 */
function injectPrompterHelperScript(page) {
  return page.evaluateOnNewDocument(function () {

    function ensureDivBoxWithText(payload) {
      ensureStyleSheet();
      const box = ensureDivBox();
      const li = getNextListItem(box);
      li.innerText = payload.text || payload;
    }

    function ensureStyleSheet() {
      if (document.querySelector('#prompter-helper-style')) {
        return;
      }
      const styleElement = document.createElement('style');
      styleElement.setAttribute('id', 'prompter-helper-style');
      //language=CSS
      styleElement.innerHTML = `
          .prompter-helper {
              pointer-events: none;
              position: fixed;
              z-index: 30001;
              left: 1rem;
              top: 1rem;
              width: 25vw;
              min-width: 200px;
              bottom: 1rem;
              background: rgba(255, 255, 255, .66);
              color: #333;
              border: 1px solid #333;
              border-radius: .25rem;
              padding: .5rem;
              font-size: 11px;
              overflow-y: scroll;
              overflow-x: hidden;
              overflow-wrap: normal;
          }

          .prompter-helper ul {
              list-style: none;
              display: block;
              margin: inherit;
              padding: .25rem;
          }

          .prompter-helper ul > li {
              list-style: none;
              display: block;
          }
      `;
      document.head.appendChild(styleElement);
    }

    function getNextListItem(box) {
      const ul = document.querySelector('.prompter-helper ul') || ((box) => {
        const ul = document.createElement('ul');
        box.appendChild(ul);
        return ul;
      })(box);
      const li = document.createElement('li');
      ul.appendChild(li);
      return li;
    }

    function ensureDivBox() {
      const result = document.querySelector('.prompter-helper');
      if (result) {
        return result;
      }
      const box = document.createElement('div');
      box.classList.add('prompter-helper');
      document.body.appendChild(box);
      return box;
    }

    function messageHandler(event) {
      try {
        const { payload, domain } = JSON.parse(event.data);
        if (domain !== 'e2e') { return; }
        ensureDivBoxWithText(JSON.stringify(payload));
      } catch (ex) {
        // ignore
      }
    }

    window.addEventListener('message', messageHandler, false);
  });
}

/**
 * !Work in progress
 * @param page
 * @param text
 * @returns {*}
 */
export function notifyUIPrompter(page, text) {
  return;
  return page.evaluate((text) => {
    window.postMessage(text, '*');
  }, JSON.stringify({ payload: text, domain: 'e2e' }));
}

function pollingForPersonalModeChange(page) {
  return page.evaluate(function () {
    const sel = `[data-role="text info"][data-role-description="current organization"]`;
    const ctx = {};
    ctx.interval = setInterval(poll, 100);

    function poll() {
      const text = document.querySelector(sel).innerText;
      if ('text' in ctx) {
        if (ctx.text === text) { return; }
        const msg = (`The current org has changed from ${ ctx.text } to ${ text }`);
        console.log(msg);
        alert(msg);
        debugger;
      }
      ctx.text = text;
    }
  });
}

function injectHoverHelperScript(page) {
  // background: transparent url("data:image/svg+xml;utf8,<svg fill='%23000000' xmlns='http://www.w3.org/2000/svg'
  // viewBox='0 0 50 50' width='50px' height='50px'><path d='M 29.699219 47 C 29.578125 47 29.457031 46.976563
  // 29.339844 46.933594 C 29.089844 46.835938 28.890625 46.644531 28.78125 46.398438 L 22.945313 32.90625 L 15.683594
  // 39.730469 C 15.394531 40.003906 14.96875 40.074219 14.601563 39.917969 C 14.238281 39.761719 14 39.398438 14 39 L
  // 14 6 C 14 5.601563 14.234375 5.242188 14.601563 5.082031 C 14.964844 4.925781 15.390625 4.996094 15.683594
  // 5.269531 L 39.683594 27.667969 C 39.972656 27.9375 40.074219 28.355469 39.945313 28.726563 C 39.816406 29.101563
  // 39.480469 29.363281 39.085938 29.398438 L 28.902344 30.273438 L 35.007813 43.585938 C 35.117188 43.824219
  // 35.128906 44.101563 35.035156 44.351563 C 34.941406 44.601563 34.757813 44.800781 34.515625 44.910156 L 30.113281
  // 46.910156 C 29.980469 46.96875 29.84375 47 29.699219 47 Z'/></svg>") no-repeat 0 0;
  return page.evaluate(function () {

    if (document.querySelector('.mouse-helper')) {
      return;
    }

    const box = document.createElement('div');
    box.classList.add('mouse-helper');
    const styleElement = document.createElement('style');
    //language=CSS
    styleElement.innerHTML = `
        .mouse-helper {
            pointer-events: none;
            position: absolute;
            z-index: 30000;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            background: rgba(0, 0, 0, .4);
            border: 1px solid white;
            border-radius: 10px;
            margin-left: -10px;
            margin-top: -10px;
            transition: background .2s, border-radius .2s, border-color .2s;
        }

        .mouse-helper.button-1 {
            transition: none;
            background: rgba(0, 0, 0, 0.9);
        }

        .mouse-helper.button-2 {
            transition: none;
            border-color: rgba(0, 0, 255, 0.9);
        }

        .mouse-helper.button-3 {
            transition: none;
            border-radius: 4px;
        }

        .mouse-helper.button-4 {
            transition: none;
            border-color: rgba(255, 0, 0, 0.9);
        }

        .mouse-helper.button-5 {
            transition: none;
            border-color: rgba(0, 255, 0, 0.9);
        }
    `;
    document.head.appendChild(styleElement);
    document.body.appendChild(box);

    document.addEventListener('mousemove', event => {
      box.style.left = event.pageX + 'px';
      box.style.top = event.pageY + 'px';
      updateButtons(event.buttons);
    }, true);

    document.addEventListener('mousedown', event => {
      updateButtons(event.buttons);
      box.classList.add('button-' + event.which);
    }, true);

    document.addEventListener('mouseup', event => {
      updateButtons(event.buttons);
      box.classList.remove('button-' + event.which);
    }, true);

    function updateButtons(buttons) {
      for (let i = 0; i < 5; i++)
        box.classList.toggle('button-' + i, buttons & (1 << i));
    }
  });
}

export async function selectByText(page, sel, text) {
  const options = await page.$$(sel + '>option');
  for (const el of options) {
    const actualText = await page.evaluate(element => element.textContent, el);
    if (actualText === text) {
      const value = await page.evaluate(element => element.value, el);
      console.log('selectByText(page, sel, text), value obtained: ' + value);
      await page.mainFrame().select(sel, value);
      return;
    }
  }
}

/**
 * @description https://github.com/peterbe/minimalcss/issues/112
 * +https://github.com/puppeteer/puppeteer/issues/1908
 */
export class InflightRequests {

  constructor(page) {
    this._page = page;
    this._requests = new Set();
    this._onStarted = this._onStarted.bind(this);
    this._onFinished = this._onFinished.bind(this);
    this._page.on('request', this._onStarted);
    this._page.on('requestfinished', this._onFinished);
    this._page.on('requestfailed', this._onFinished);
    this._isDisposed = false;
  }

  _onStarted(request) {
    this._requests.add(request);
  }

  _onFinished(request) {
    this._requests.delete(request);
  }

  inflightRequests() {
    return Array.from(this._requests);
  }

  isDisposed() {
    return this._isDisposed;
  }

  dispose() {
    this._page.removeListener('request', this._onStarted);
    this._page.removeListener('requestfinished', this._onFinished);
    this._page.removeListener('requestfailed', this._onFinished);
    delete this._page;
    this._isDisposed = true;
  }
}
