import notifier from './reporters/defaultNotifier';
import { DEFAULT_TIMEOUT } from './jest.setup';
import { makeScreenshot, testWrap } from './testWrapper';
import { ensureLocalizedTimeString, obtainTestInfo } from './testInfoProvider';
import { ensureEnvVariable } from '../src/shared/env';
import { waitForTimeout } from './puppeteerExtensions';
import { setUpBrowserAndPage } from './browserSetup';
import { navigation } from './pages/navigation';
import { landingPage } from './pages/landing';
import { restaurantsListPage } from './pages/restaurantsList';
import { restaurantMenuPage } from './pages/restaurantMenu';
import { checkoutPage } from './pages/checkout';
import { summarizePageObject } from './pages/utilities';
import { thankYouPage } from './pages/thankYou';

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

  beforeAll(async () => {
    await ensureLocalizedTimeString(page, testInfo);
  });

  afterAll(async () => {
    await waitForTimeout(page, 1000);
  });

  afterAll(() => {
    summarizePageObject(true);
  });

  describe('00. Ground-zero tests. Browser capabilities', () => {

    test(`Settings`, () => {

      console.log('NODE_ENV: ', process.env.NODE_ENV);
      console.log(ensureEnvVariable('TEST_UI_URL'), testInfo.email);
      console.log('[testInfo.goodAddress.time]', testInfo.goodAddress.time);

    });

    test(`Navigation to Landing and a screenshot`, async () => {

      await navigation(page).visitTheSite();
      await landingPage(page).expectVisitingSelf();

      await makeScreenshot(page, { label: 'intro' });

    });
  });

  describe(`[Landing Page] -> Restaurants List -> Menu Page`, () => {

    test(`Navigation to Landing`, async () => {
      await navigation(page).visitTheSite();
      await landingPage(page).expectVisitingSelf();
    });

    test(`[landing page] Correct entry, submission, landing on Restaurants List`, async () => {

      await landingPage(page).fillOutTheAddressAndTimeForm(testInfo.goodAddress);
      await landingPage(page).submitTheAddressAndTimeFormSuccessfully();
      await restaurantsListPage(page).expectVisitingSelf();

    });

    test(`[restaurants list page] Navigation, picking correct restaurant, landing of Menu page`, async () => {

      await restaurantsListPage(page).browseForRestaurantWithMenuItems();
      await restaurantMenuPage(page).expectVisitingSelf();

    });

    test(`[restaurant menu page] Structure check, menu picking, going to checkout`, async () => {
      await restaurantMenuPage(page).checkStructure();
      await restaurantMenuPage(page).putMenuItemIntoACart();
      await restaurantMenuPage(page).proceedToCheckout();

      await checkoutPage(page).expectVisitingSelf();
    });

    describe(`[checkout page]`, () => {

      test(`[required elements before payment]`, async () => {
        await checkoutPage(page, expect).expectCartNotEmptyAndReadyToPay();
      });

      test(`[payment modal interaction]`, async () => {
        await checkoutPage(page, expect).playWithThePaymentModal();
      });

      test(`[payment form interaction]`, async () => {
        await checkoutPage(page, expect).playWithThePaymentFormRequireds();
      });

      test(`[payment form] declined payment`, async () => {

        await checkoutPage(page, expect).attemptDeclinedCard();

      });

      test(`[payment form] accepted payment`, async () => {

        await checkoutPage(page, expect).attemptValidOkCard();

      });

      describe(`[thank you page]`, () => {

        test(`[thank you page] successful navigation`, async () => {

          await thankYouPage(page, expect).expectVisitingSelf();

        });

        test(`[thank you page] order ID is present`, async () => {

          await thankYouPage(page, expect).ensureOrderIdIsPresent();

        });
      })

    });

  });

});
