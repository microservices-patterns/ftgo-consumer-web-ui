import { tagPageObject } from './utilities';
import { element } from '../helpers';
import { SEL } from '../../src/testability';

const thankYouPageEl = page => element(page, SEL.PAGE_THANKYOU);
const textOrderId = page => element(page, SEL.TEXT_ORDER_ID);

export const thankYouPage = (page, expect) => tagPageObject('thankYouPage', {
  expectVisitingSelf: () => thankYouPageEl(page).ensurePresent(),
  ensureOrderIdIsPresent: async () => {

    const [ err, orderIdText ] = await textOrderId(page).safelyGetText();
    expect(err).toBeNull();
    expect(orderIdText.replace('#', '')).toBeTruthy();
  }
});
