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
    await spinIcon(page).ensurePresent();

    await waitForTimeout(page, 300);
  }

});
