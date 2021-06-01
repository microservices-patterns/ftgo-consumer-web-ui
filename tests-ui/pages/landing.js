import { waitClickAndType, waitForSelector, waitForSelectorAndClick, waitForTimeout } from '../puppeteerExtensions';
import { SEL } from '../selectors';
import { makeScreenshot } from '../testWrapper';
import { tagPageObject } from './utilities';

export const landingPage = page => tagPageObject('landingPage', {
  expectVisitingSelf: () => waitForSelector(page, SEL.PAGE_LANDING),
  fillOutTheAddressAndTimeForm: async (testData) => {
    await waitForSelector(page, SEL.FORM_PICK_ADDRESS_TIME);
    await waitClickAndType(page, SEL.FORM_FIELD_ADDRESS, testData.address);
    await waitForTimeout(page, 10);

    await waitClickAndType(page, SEL.FORM_FIELD_TIME, testData.time);
    await waitForTimeout(page, 10);

    await makeScreenshot(page, { label: 'time_entry' });
  },
  submitTheAddressAndTimeFormSuccessfully: async () => {
    await waitForSelectorAndClick(page, SEL.BTN_SUBMIT_FORM_PICK_ADDRESS_TIME);
    await waitForTimeout(page, 10);
    await waitForSelector(page, SEL.BTN_SUBMIT_FORM_PICK_ADDRESS_TIME + '[disabled]');
    await waitForSelector(page, SEL.ICON_SPIN);

    await waitForTimeout(page, 300);
  }
});
