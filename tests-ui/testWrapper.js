import { existsSync, mkdirSync, writeFile, writeFileSync } from 'fs';
import path from 'path';
import { promisify } from 'util';
import { DEFAULT_TIMEOUT } from './jest.setup';
import { getQuicklyLocationPathnameAndSearch } from './puppeteerExtensions';

const started = new Date();
const memo = {
  testNumber: 1
};

const artifactsPath = path.resolve(__dirname, '..', 'ci-artifacts');
if (!existsSync(artifactsPath)) {
  mkdirSync(artifactsPath, { recursive: true });
}

let adHocScreenshotsBunchCount = 0;
let adHocScreenshotsCount = 0;
/**
 * Captures stack, etc.
 * @param _test
 * @param context
 * @returns {function(*=, *=, *=): *}
 */
export const testWrap = (_test, context, fallbackTimeout = 10) => {

  let errCounter = 0;

  process.on('unhandledRejection', (reason, promise) => {
    const savePath = `${ artifactsPath }/unhandledRejection_e2e_error_log_${ getTimestampPart(started) }_${ errCounter }.txt`;
    const savePathExtra = `${ artifactsPath }/unhandledRejection_e2e_error_log_${ getTimestampPart(started) }_${ errCounter++ }_ext.txt`;
    try {
      writeFileSync(savePath, reason);
      promise.catch((ex) => {
        writeFileSync(savePathExtra, `Exception: ${ ex }\nStack: ${ ex.stack }`);
      });
    } catch (ex) {}
  });

  let effectiveTest = _test;

  function only(...args) {
    effectiveTest = _test.only;
    return newTest(...args);
  }

  let newTest;
  return Object.assign(newTest = function newTest(name, afn, timeoutProduct = 50) {
    //console.log(`Setting a watched test(${ name }, async fn, ${ timeout })`);
    const effectiveTimeout = ((timeoutProduct !== undefined) ? (timeoutProduct <= 1000 ? (timeoutProduct * fallbackTimeout) : timeoutProduct) : fallbackTimeout || DEFAULT_TIMEOUT);
    return effectiveTest(name, function (...args) {
      //console.log(`Invoked a jest-test (${ name }, async fn, ${ timeout })`);
      context.consoleMsgs = [];
      let timeoutRef;
      const ts = new Date() - 0;
      return new Promise(async (rs, rj) => {
        timeoutRef = setTimeout(() => {
          try {
            console.log(`Elapsed ${ new Date() - ts } ms`);
          } catch (ex) {}
          rj(Object.assign(new Error('Test execution timeout, gathering stats'), { name: 'timeout' }));
        }, effectiveTimeout - 10); // just a bit earlier, that's all
        try {
          await afn(...args);
        } catch (ex) {
          clearTimeout(timeoutRef);
          return rj(ex);
        }
        clearTimeout(timeoutRef);
        rs();
      }).catch(async ex => {
        const { testNumber } = memo;
        memo.testNumber++;
        const { page } = context;

        if (page) {

          try {
            console.log(`Test "${ name }" failed. #${ testNumber }`);
            const failedLocation = await getQuicklyLocationPathnameAndSearch(page);
            console.log(`Url: ${ failedLocation }`);

            await makeHtmlDump(page, { testNumber, name, failedLocation });
            await makeScreenshot(page, { testNumber });
            await makeBrowsersConsoleDump(page, { testNumber, ex }, context);

          } catch (ex) {
            console.log(`Gathering stats has failed. Reason: ${ ex }`);
          }

        } else {
          console.log(`Test: "${ name }" failed. Page dump is impossible. 'page' is not set.`);
        }
        throw ex;
      });
    }, effectiveTimeout);
  }, { only });
};

async function makeBrowsersConsoleDump(page, { testNumber, ex }, memoObj) {
  try {
    const consoleDumpPath = `${ artifactsPath }/art_${ getTimestampPart(started) }_${ testNumber }_console.txt`;
    const consoleDump = memoObj.consoleMsgs
      .concat([ [ String(ex), ex?.message ?? 'unknown', ex?.stack ?? 'no stack' ] ])
      .map(entry => entry.join(' ')).join('\r\n');
    void await promisify(writeFile)(consoleDumpPath, consoleDump);
    console.log(`Browser's console dump saved: ${ consoleDumpPath }`);
  } catch (ex) {
    console.log(`Browser's console failed. Reason: ${ ex }`);
  }
}

export async function makeHtmlDump(page, { testNumber, name, failedLocation }) {

  try {
    const pageContentDumpPath = `${ artifactsPath }/art_${ getTimestampPart(started) }_${ testNumber }_dom.html`;
    const pageContent = await page.content();
    const effectiveDumpInfo = [
      `<!-- URL: ${ failedLocation } -->`,
      `<!-- Test: ${ name } -->`,
      pageContent
    ].join('\r\n').replace(new RegExp('<script[^>]*>([\\S\\s]*?)<\/script\\s*>', 'img'), '');

    void await promisify(writeFile)(pageContentDumpPath, effectiveDumpInfo);
    console.log(`Page dump saved: ${ pageContentDumpPath }`);
  } catch (ex) {
    console.log(`Page DOM dump not saved. Reason: ${ ex }`);
  }
}

export async function makeScreenshot(page, { testNumber, label, labelIndex, resetCount, skip, clip }) {
  if (skip === true) {
    return;
  }
  const isTestNumberPresent = testNumber !== undefined;
  if (resetCount) {
    adHocScreenshotsCount = 0;
    adHocScreenshotsBunchCount++;
  }
  const testItemLabel = isTestNumberPresent ? testNumber : `${ adHocScreenshotsBunchCount }_${ adHocScreenshotsCount++ }_${ label || 'adhoc' }${
    (labelIndex == null ? '' : `_${ labelIndex }`) }`;
  try {
    const screenshotPath = `${ artifactsPath }/art_${ getTimestampPart(started) }_${ testItemLabel }_shot.png`;
    void await page.screenshot({
      path: screenshotPath,
      ...(clip ? {} : { fullPage: true })
    });
    console.log(`Screenshot saved: ${ screenshotPath }`);
  } catch (ex) {
    console.log(`Screenshot taking has failed. Reason: ${ ex }`);
  }
}

function getTimestampPart(input) {
  const now = input || new Date();
  const [ year, month, date ] = [ now.getFullYear(), now.getMonth(), now.getDate() ];
  const remainder = now - new Date(year, month, date);
  const padding = [ undefined, 2, 2, 5 ];
  return [
    year, month + 1, date, Math.floor(remainder / 1000)
  ].map(String).map((str, idx) => padding[ idx ] ? str.padStart(padding[ idx ], '0') : str).join('_');
}
