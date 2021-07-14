import { waitForSelector, waitForTimeout } from '../puppeteerExtensions';
import { SEL } from '../selectors';
import { makeScreenshot } from '../testWrapper';
import { tagPageObject } from './utilities';
import {
  addressAndTimeForm,
  addressAndTimeFormSubmitButton,
  addressField,
  spinIcon,
  timeField
} from './pageComponents';
import { safelyExecuteAsync } from '../../src/shared/promises';

export const landingPage = page => tagPageObject('landingPage', {

  expectVisitingSelf: () => waitForSelector(page, SEL.PAGE_LANDING),

  fillOutTheAddressAndTimeForm: async (testData) => {
    await addressAndTimeForm(page).ensurePresent();
    await addressField(page).enter(testData.address);
    await timeField(page).enter(testData.time);

    await makeScreenshot(page, { label: 'time_entry' });
  },

  submitTheAddressAndTimeFormSuccessfully: async () => {
    await addressAndTimeFormSubmitButton(page).click();
    await addressAndTimeFormSubmitButton(page).expectDisabled();
    const [ err ] = await safelyExecuteAsync(spinIcon(page).ensurePresent({ timeout: 5000 }));

    err && console.warn('[submitTheAddressAndTimeFormSuccessfully] Spinner was absent')

    await waitForTimeout(page, 300);
  }

});
