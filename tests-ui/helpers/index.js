//textField(page, SEL.FORM_FIELD_ADDRESS).enter(testData.address)

//await waitClickAndType(page, SEL.FORM_FIELD_ADDRESS, testData.address);
//await waitForTimeout(page, 10);
import { waitClickAndType, waitForSelector, waitForSelectorAndClick } from '../puppeteerExtensions';
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
}

export const element = (page, sel) => {
  return {
    ensurePresent() {
      return waitForSelector(page, sel);
    },
    click() {
      return waitForSelectorAndClick(page, sel);
    },
    expectDisabled() {
      return waitForSelector(page, cssSel(sel).mod('[disabled]'))
    }
  }
}
