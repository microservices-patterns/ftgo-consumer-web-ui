//textField(page, SEL.FORM_FIELD_ADDRESS).enter(testData.address)

//await waitClickAndType(page, SEL.FORM_FIELD_ADDRESS, testData.address);
//await waitForTimeout(page, 10);
import { waitClickAndType, waitForSelector, waitForSelectorAndClick, waitForTimeout } from '../puppeteerExtensions';
import { cssSel } from '../../src/shared/e2e';

export const textField = (page, sel) => {
  return {
    enter(text) {
      return waitClickAndType(page, sel, text);
    },
    ensurePresent() {
      return waitForSelector(page, sel);
    },
  };
};

export const element = (page, sel) => {
  return {
    ensurePresent() {
      return waitForSelector(page, sel);
    },
    async click() {
      await waitForSelectorAndClick(page, sel);
      return waitForTimeout(page, 10);
    },
    async expectDisabled() {
      return waitForSelector(page, cssSel(sel).mod('[disabled]'));
    },
    expectNotDisabled() {
      return waitForSelector(page, cssSel(sel).mod(':not([disabled])'));
    }
  };
};
