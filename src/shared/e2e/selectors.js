import { prepareSelector, prepareSelectorOpen } from './helpers';

export const selectors = fn => applyForEachPair({
  PAGE_LANDING: prepareSelector('page', 'landing'),

  FORM_PICK_ADDRESS_TIME: prepareSelector('form', 'pick delivery time and address'),
  FORM_FIELD_ADDRESS: prepareSelector('field', 'text input', 'address'),
  FORM_FIELD_TIME: prepareSelector('field', 'time input', 'time'),
  FORM_FEEDBACK_ADDRESS: prepareSelector('feedback', 'error feedback', 'address'),
  FORM_FEEDBACK_TIME: prepareSelector('feedback', 'error feedback', 'time'),
  BTN_SUBMIT_FORM_PICK_ADDRESS_TIME: prepareSelector('button', 'submit', 'landing page form'),
  ICON_SPIN: prepareSelector('icon', 'spinning'),

  PAGE_RESTAURANTS_LIST: prepareSelector('page', 'restaurants list'),
  TEXT_RESTAURANTS_LIST_SIZE: prepareSelector('text', 'restaurants list size'),

  TBL_RESTAURANTS_LIST: prepareSelector('table', 'restaurants list'),
  CTL_SIZE_PER_PAGE_FOR_TABLE: prepareSelector('table nav', 'pagination control', 'size per page'),
  CTL_PAGINATION_FOR_TABLE: prepareSelector('table nav', 'pagination control', 'pagination buttons'),

  PAGE_RESTAURANT_MENU: prepareSelector('page', 'restaurant menu'),
  TBL_RESTAURANT_MENU: prepareSelector('table', 'restaurant menu'),
  TBL_YOUR_TRAY: prepareSelector('table', 'your tray'),

  BTN_TO_CHECKOUT: prepareSelector('button', 'navigation', 'to checkout'),
  BTN_ADD_TO_CART: prepareSelector('button', 'add to cart'),
  BTN_ADD_TO_CART_FRESH: prepareSelector('button', 'add to cart', 'no such item in cart'),
  BTN_ADD_TO_CART_ADDED: prepareSelector('button', 'add to cart', 'already in cart'),

  INFO_MENU_IS_EMPTY: prepareSelector('text', 'menu table is empty'),
  INFO_TRAY_IS_EMPTY: prepareSelector('text', 'tray table is empty'),
  INFO_CART_VALUE: prepareSelector('text', 'cart subtotal'),
  INFO_CART_VALUE_OF: prepareSelectorOpen('text', 'cart subtotal'),

  PAGE_CHECKOUT: prepareSelector('page', 'checkout'),

}, fn);


/**
 *
 * @param obj { Object<string,function(arg: function(*): T):T>}
 * @param fn { function(*): T}
 * @return {Object<string, T>}
 */
function applyForEachPair(obj, fn) {
  return Object.fromEntries(
    Array.from(Object.entries(obj || {}),
      ([ k, v ]) => [ k, typeof v === 'function' ? v(fn) : v ]));
}
