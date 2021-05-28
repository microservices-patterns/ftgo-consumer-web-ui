
import notifier from './reporters/defaultNotifier';
import { DEFAULT_TIMEOUT } from './jest.setup';
import { makeScreenshot, testWrap } from './testWrapper';
import { obtainTestInfo } from './testInfoProvider';
import { ensureEnvVariable } from '../src/shared/env';
import { navigateToWithinApp } from './navigation';
import { waitForTimeout } from './puppeteerExtensions';
import { setUpBrowserAndPage } from './browserSetup';

void makeScreenshot;

const ctx = {
  page: null,
  store: new Map(),
  testInfo: null
};

const TIMEOUT = DEFAULT_TIMEOUT;
const test$ = testWrap(global.test, ctx, TIMEOUT);
const [ describe, xdescribe, test, xtest ] = ((d, xd) => ([
  d,
  process.env.NODE_ENV === 'test' ? xd : d,
  test$,
  process.env.NODE_ENV === 'test' ? global.xtest : test$
]))(global.describe, global.xdescribe);

void xtest;
void xdescribe;

const [ width, height ] = ensureEnvVariable('TEST_UI_DIMENSIONS', '1200x800').split('x').map(Number);

let page = setUpBrowserAndPage({ beforeAll, afterAll }, ctx, { width, height }, p => {
  ctx.page = page = p;
  // TODO: The default value can be changed by using the page.setDefaultNavigationTimeout(timeout) or
  // page.setDefaultTimeout(timeout) methods. NOTE page.setDefaultNavigationTimeout takes priority over
  // page.setDefaultTimeout
});

const testInfo = ctx.testInfo = obtainTestInfo();


console.log('NODE_ENV: ', process.env.NODE_ENV, ensureEnvVariable('TEST_UI_URL'), testInfo.email, testInfo.password, `(${ testInfo.newPassword })`);


// https://www.valentinog.com/blog/ui-testing-jest-puppetteer/


async function warnSpectator(page) {
  await notifier.notify('The interesting part starts in less than 5 seconds');
  await page.waitForTimeout(5000);
}

void warnSpectator;

describe('Interaction with the entire FTGO UI application:', () => {

  describe('00. Ground-zero tests. Browser capabilities', () => {

    test(`Settings`, () => {
      console.log('NODE_ENV: ', process.env.NODE_ENV);
      console.log(ensureEnvVariable('TEST_UI_URL'), testInfo.email);
    });

    test(`Navigation to Laning and a screenshot`, async () => {

     await navigateToWithinApp(page, '/');
     await waitForTimeout(page, 10000);
     await makeScreenshot(page, { label: 'intro' })

    });
  });


});
