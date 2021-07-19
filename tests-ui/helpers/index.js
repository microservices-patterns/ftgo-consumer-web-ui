//textField(page, SEL.FORM_FIELD_ADDRESS).enter(testData.address)

//await waitClickAndType(page, SEL.FORM_FIELD_ADDRESS, testData.address);
//await waitForTimeout(page, 10);
import {
  readElementsText,
  waitClickAndType,
  waitForSelector,
  waitForSelectorAndClick,
  waitForSelectorNotPresent,
  waitForTimeout
} from '../puppeteerExtensions';
import { cssSel } from '../../src/shared/e2e';
import { safelyExecuteAsync } from '../../src/shared/promises';

export const textField = (page, sel) => {
  return {
    enter(text, replace) {
      return waitClickAndType(page, sel, text, replace);
    },
    ensurePresent() {
      return waitForSelector(page, sel);
    },
    expectInvalid() {
      return waitForSelector(page, cssSel(sel).attr('data-testid', '|invalid|', '*'));
    },
    expectNotInvalid() {
      return waitForSelector(page, cssSel(sel).not(cssSel('').attr('data-testid', '|invalid|', '*')));
    }
  };
};

export const element = (page, sel) => {
  return {
    ensurePresent(options) {
      return waitForSelector(page, sel, options);
    },
    expectAbsent() {
      return waitForSelectorNotPresent(page, sel);
    },
    async click() {
      await waitForSelectorAndClick(page, sel);
      return waitForTimeout(page, 10);
    },
    async expectDisabled(options) {
      return waitForSelector(page, cssSel(sel).mod('[disabled]'), options);
    },
    expectNotDisabled() {
      return waitForSelector(page, cssSel(sel).mod(':not([disabled])'));
    },
    async count() {
      console.log(`[Element.count]for selector: "${ String(sel) }"`);
      return (await page.$$(String(sel))).length;
    },
    has(childSel) {
      return waitForSelector(page, cssSel(sel).desc(childSel));
    },
    safelyGetText() {
      return safelyExecuteAsync(readElementsText(page, sel));
    }
  };
};
