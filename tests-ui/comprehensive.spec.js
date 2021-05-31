import notifier from './reporters/defaultNotifier';
import { DEFAULT_TIMEOUT } from './jest.setup';
import { makeScreenshot, testWrap } from './testWrapper';
import { obtainTestInfo } from './testInfoProvider';
import { ensureEnvVariable } from '../src/shared/env';
import { navigateToWithinApp } from './navigation';
import {
  waitClickAndType,
  waitForSelector,
  waitForSelectorAndClick,
  waitForSelectorWithText,
  waitForTimeout
} from './puppeteerExtensions';
import { setUpBrowserAndPage } from './browserSetup';
import { SEL } from './selectors';

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

    test(`Navigation to Landing and a screenshot`, async () => {

      await navigateToWithinApp(page, '/');
      await waitForTimeout(page, 1000);
      await waitForSelector(page, SEL.PAGE_LANDING);
      await makeScreenshot(page, { label: 'intro' });

      const timeRaw = testInfo.goodAddress.timeRaw;

      testInfo.goodAddress.time = (await page.evaluate(
        d => new Date(d).toLocaleTimeString(navigator.language, {
          hour: "2-digit",
          minute: "2-digit"
        }),
        timeRaw
      )).replace(' ', '');
      console.log('[testInfo.goodAddress.time]', testInfo.goodAddress.time);

    });
  });

  describe(`10. Landing Page -> Restaurants List -> Menu Page`, () => {

    test(`Navigation to Landing`, async () => {
      await navigateToWithinApp(page, '/');
      await waitForTimeout(page, 1000);
      await waitForSelector(page, SEL.PAGE_LANDING);
    });

    test(`[landing page] Correct entry, submission, landing on Restaurants List`, async () => {

      await waitForSelector(page, SEL.FORM_PICK_ADDRESS_TIME);
      await waitClickAndType(page, SEL.FORM_FIELD_ADDRESS, testInfo.goodAddress.address);
      await waitForTimeout(page, 10);

      await waitClickAndType(page, SEL.FORM_FIELD_TIME, testInfo.goodAddress.time);
      await waitForTimeout(page, 10);

      await makeScreenshot(page, { label: 'time_entry' });

      await waitForSelectorAndClick(page, SEL.BTN_SUBMIT_FORM_PICK_ADDRESS_TIME);
      await waitForTimeout(page, 10);
      await waitForSelector(page, SEL.BTN_SUBMIT_FORM_PICK_ADDRESS_TIME + '[disabled]');
      await waitForSelector(page, SEL.ICON_SPIN);

      await waitForTimeout(page, 300);

      await waitForSelector(page, SEL.PAGE_RESTAURANTS_LIST);
    });

    test(`[restaurants list page] Navigation, picking correct restaurant, landing of Menu page`, async () => {
      await waitForSelector(page, SEL.TBL_RESTAURANTS_LIST);
      await waitForSelector(page, `${ SEL.TBL_RESTAURANTS_LIST } ${ SEL.CTL_PAGINATION_FOR_TABLE }`);
      await waitForSelectorAndClick(page, `${ SEL.TBL_RESTAURANTS_LIST } ${ SEL.CTL_PAGINATION_FOR_TABLE } .page-item[title="2"]>a.page-link`);

      const el = await waitForSelectorWithText(page, 'td', 'All items');
      await el.click();

      await waitForSelector(page, SEL.PAGE_RESTAURANT_MENU);
    });

  });

});
