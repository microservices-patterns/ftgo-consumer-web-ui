import {
  waitForSelector,
  waitForSelectorAndClick,
  waitForSelectorNotPresent,
  waitForTimeout
} from '../puppeteerExtensions';
import { SEL } from '../selectors';
import { tagPageObject } from './utilities';
import { cssSel } from '../../src/shared/e2e';
import { element } from '../helpers';

const restaurantMenuTable = page => element(page, SEL.TBL_RESTAURANT_MENU);
const yourTrayTable = page => element(page, SEL.TBL_YOUR_TRAY);
const toCheckoutButton = page => element(page, SEL.BTN_TO_CHECKOUT);
const addToCartButton = page => element(page, SEL.BTN_ADD_TO_CART);

export const restaurantMenuPage = page => tagPageObject('restaurantMenuPage', {

  expectVisitingSelf: () => waitForSelector(page, SEL.PAGE_RESTAURANT_MENU),

  checkStructure: async () => {
    await restaurantMenuTable(page).ensurePresent();
    await yourTrayTable(page).ensurePresent();
    await toCheckoutButton(page).ensurePresent();
  },

  putMenuItemIntoACart: async () => {
    await toCheckoutButton(page).expectDisabled();

    await waitForSelector(page, cssSel(SEL.INFO_TRAY_IS_EMPTY));
    await waitForSelector(page, cssSel(SEL.INFO_CART_VALUE_OF(0)));

    const paginationControlSel = cssSel(SEL.TBL_RESTAURANT_MENU).desc(SEL.CTL_PAGINATION_FOR_TABLE);
    await waitForSelector(page, paginationControlSel);
    await waitForSelector(page,
      paginationControlSel.desc('.page-item').attr('title', 'next page').child('a.page-link'));

    await waitForSelectorNotPresent(page, SEL.BTN_ADD_TO_CART_ADDED);
    await addToCartButton(page).ensurePresent();
    await waitForSelector(page, SEL.BTN_ADD_TO_CART_FRESH);

    await waitForSelectorAndClick(page, SEL.BTN_ADD_TO_CART_FRESH);
    await addToCartButton(page).expectDisabled();


    await waitForTimeout(page, 1000);
    await waitForSelector(page, SEL.BTN_ADD_TO_CART_ADDED);

    await toCheckoutButton(page).expectNotDisabled();

    await waitForSelectorNotPresent(page, cssSel(SEL.INFO_CART_VALUE_OF(0)));

  },

  proceedToCheckout: async () => {
    await toCheckoutButton(page).expectNotDisabled();
    await toCheckoutButton(page).click();
  }
});
