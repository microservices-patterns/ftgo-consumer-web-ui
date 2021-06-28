import {
  waitForSelector,
  waitForSelectorAndClick,
  waitForSelectorNotPresent,
  waitForTimeout
} from '../puppeteerExtensions';
import { MOD, SEL } from '../selectors';
import { tagPageObject } from './utilities';
import { cssSel } from '../../src/shared/e2e';

export const restaurantMenuPage = page => tagPageObject('restaurantMenuPage', {

  expectVisitingSelf: () => waitForSelector(page, SEL.PAGE_RESTAURANT_MENU),

  checkStructure: async () => {
    await waitForSelector(page, SEL.TBL_RESTAURANT_MENU);
    await waitForSelector(page, SEL.TBL_YOUR_TRAY);
    await waitForSelector(page, cssSel(SEL.BTN_TO_CHECKOUT));
  },

  putMenuItemIntoACart: async () => {

    await waitForSelector(page, cssSel(SEL.BTN_TO_CHECKOUT).mod(MOD.ATTR_DISABLED));
    await waitForSelector(page, cssSel(SEL.INFO_TRAY_IS_EMPTY));
    await waitForSelector(page, cssSel(SEL.INFO_CART_VALUE_OF('0.00')));

    const paginationControlSel = cssSel(SEL.TBL_RESTAURANT_MENU).desc(SEL.CTL_PAGINATION_FOR_TABLE);
    await waitForSelector(page, paginationControlSel);
    await waitForSelector(page,
      paginationControlSel.desc('.page-item').attr('title', 'next page').child('a.page-link'));

    await waitForSelectorNotPresent(page, SEL.BTN_ADD_TO_CART_ADDED);
    await waitForSelector(page, SEL.BTN_ADD_TO_CART);
    await waitForSelector(page, SEL.BTN_ADD_TO_CART_FRESH);

    await waitForSelectorAndClick(page, SEL.BTN_ADD_TO_CART_FRESH);
//    await waitForTimeout(page, 10);
    await waitForSelector(page, cssSel(SEL.BTN_ADD_TO_CART).mod(MOD.ATTR_DISABLED));

    await waitForTimeout(page, 1000);
    await waitForSelector(page, SEL.BTN_ADD_TO_CART_ADDED);

    await waitForSelector(page, cssSel(SEL.BTN_TO_CHECKOUT).mod(MOD.ATTR_NOT_DISABLED));
    await waitForSelectorNotPresent(page, cssSel(SEL.INFO_CART_VALUE_OF('0.00')));

  },

  proceedToCheckout: async () => {

    await waitForSelector(page, cssSel(SEL.BTN_TO_CHECKOUT).mod(MOD.ATTR_NOT_DISABLED));
    await waitForSelectorAndClick(page, SEL.BTN_TO_CHECKOUT);

  }
});
