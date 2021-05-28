import { safelyExecuteAsync } from '../src/shared/promises';
import { ensureEnvVariable } from '../src/shared/env';
import { injectHelperScripts, waitForPathnameLocation, waitForSelector } from './puppeteerExtensions';
import { SEL } from './selectors';

const throwIfUndefined = (arg) => {
  if (arg === undefined) {
    throw new Error();
  }
  return arg;
}
export const urlPatterns = {
  landing: /^\/start$/i,
};

export const appPaths = {
  loginPage: '/login',
  landing: '/apps',
  emptyResetPage: '/reset'
};

export const APP_URL = ensureEnvVariable('TEST_UI_URL');

const navContext = {
  requestsTracker: undefined
};

export function initializeNavigationContext(props) {
  Object.assign(navContext, props);
}

/**
 *
 * @param page Puppeteer page handle
 * @param relativePath - address to navigate to within APP
 * @returns {Promise<void>}
 */
export async function navigateToWithinApp(page, relativePath = '') {
  const url = removeDoubledSlashes(APP_URL + relativePath);
  console.log(`Navigating to URL: ${ url }`);
  const [ errNWI0 ] = await safelyExecuteAsync(page.goto(url, { waitUntil: 'networkidle0' }));
  if (errNWI0) {

    const inflight = navContext?.requestsTracker.inflightRequests() || [];
    console.log(inflight.map(request => '  ' + request.url()).join('\n'));

    const [ errNWI2 ] = await safelyExecuteAsync(page.goto(url, { waitUntil: 'networkidle2' }));
    if (errNWI2) {
      throw new Error(`Navigation to URL '${ url }' timed out. There are more than 2 open connections.`);
    }
    console.warn(`Navigation to URL '${ url }' has still not more than 2 open connections.`);
  } else {
    console.log(`Navigation to URL '${ url }' - Success`);
  }
  await injectHelperScripts(page);
}

export async function navigationToMissingApp(page, context) {
  const path = throwIfUndefined(context.store.get('sampleAppIdUrl')).replace(context.store.get('sampleAppId'), 'NONEXISTENT_APP');
  await navigateToMissingEntitySteps(page, path, urlPatterns.landing);
}

export async function navigateToMissingServiceWithinMissingApp(page, context) {
  const path = `${ throwIfUndefined(context.store.get('sampleAppIdUrl')).replace(context.store.get('sampleAppId'), 'NONEXISTENT_APP') }/service/NONEXISTENT_SVC`;
  await navigateToMissingEntitySteps(page, path, urlPatterns.landing);
}

export async function navigateToMissingServiceWithinExistingApp(page, context) {
  const path = `${ throwIfUndefined(context.store.get('sampleAppIdUrl')) }/service/NONEXISTENT_SVC`;
  await navigateToMissingEntitySteps(page, path, urlPatterns.appItemPage);
}

async function navigateToMissingEntitySteps(page, path, urlPattern) {
  await navigateToWithinApp(page, path);
  await Promise.all([
    waitForSelector(page, SEL.ALERT_INFO),
    waitForSelector(page, SEL.ALERT_DANGER)
  ]);
  await waitForPathnameLocation(page, urlPattern);
}


function removeDoubledSlashes(input) {
  return input.replace('://', '_PROTO_SEP_').replace('//', '/').replace('_PROTO_SEP_', '://');
}
