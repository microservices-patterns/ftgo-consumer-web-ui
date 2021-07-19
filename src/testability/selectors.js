import { defineTestIdDictionary } from '../shared/e2e';

/**
 *
 * @type {(function(("test"|"render")): Object<string, T|P>)|T|P}
 */
export const selectors = defineTestIdDictionary((testId, testIdRest) => ({
  PAGE_LANDING: testId('page', 'landing'),

  FORM_PICK_ADDRESS_TIME: testId('form', 'pick delivery time and address'),
  FORM_FIELD_ADDRESS: testId('field', 'text input', 'address'),
  FORM_FIELD_TIME: testId('field', 'time input', 'time'),
  FORM_FEEDBACK_ADDRESS: testId('feedback', 'error feedback', 'address'),
  FORM_FEEDBACK_TIME: testId('feedback', 'error feedback', 'time'),
  BTN_SUBMIT_FORM_PICK_ADDRESS_TIME: testId('button', 'submit', 'landing page form'),
  ICON_SPIN: testId('icon', 'spinning'),

  PAGE_RESTAURANTS_LIST: testId('page', 'restaurants list'),
  TEXT_RESTAURANTS_LIST_SIZE: testId('text', 'restaurants list size'),

  TBL_RESTAURANTS_LIST: testId('table', 'restaurants list'),
  CTL_SIZE_PER_PAGE_FOR_TABLE: testId('table nav', 'pagination control', 'size per page'),
  CTL_PAGINATION_FOR_TABLE: testId('table nav', 'pagination control', 'pagination buttons'),

  PAGE_RESTAURANT_MENU: testId('page', 'restaurant menu'),
  TBL_RESTAURANT_MENU: testId('table', 'restaurant menu'),
  TBL_YOUR_TRAY: testId('table', 'your tray'),

  BTN_TO_CHECKOUT: testId('button', 'navigation', 'to checkout'),
  BTN_ADD_TO_CART: testId('button', 'add to cart'),
  BTN_ADD_TO_CART_FRESH: testId('button', 'add to cart', 'no such item in cart'),
  BTN_ADD_TO_CART_ADDED: testId('button', 'add to cart', 'already in cart'),

  INFO_MENU_IS_EMPTY: testId('text', 'menu table is empty'),
  INFO_TRAY_IS_EMPTY: testId('text', 'tray table is empty'),
  INFO_CART_VALUE: testId('text', 'cart subtotal'),
  INFO_CART_VALUE_OF: testIdRest('text', 'cart subtotal'),

  PAGE_CHECKOUT: testId('page', 'checkout'),
  PAGE_THANKYOU: testId('page', 'thank you'),

  MODAL_PAYMENT: testId('modal', 'payment'),
  BTN_MODAL_PAYMENT_DISMISS_FN: testIdRest('button', 'dismiss payment modal'),
  BTN_MODAL_PAYMENT_DISMISS_GENERAL: testId('button', 'dismiss payment modal'),
  BTN_MODAL_PAYMENT_DISMISS: testId('button', 'dismiss payment modal', 'dismiss'),
  BTN_MODAL_PAYMENT_CANCEL: testId('button', 'dismiss payment modal', 'cancel'),

  FORM_PAYMENT: testId('form', 'payment'),
  BTN_FORM_PAYMENT_SUBMIT: testId('button', 'submit payment form'),
  TEXT_FORM_PAYMENT_ERRORS: testId('text', 'payment form errors'),
  TEXT_FORM_PAYMENT_SUCCESS: testId('text', 'payment form success'),

  FLD_FORM_PAYMENT_FN: testIdRest('field', 'payment form'),
  FLD_FORM_PAYMENT_CARD_NUMBER: testId('field', 'payment form', 'card_number'),
  FLD_FORM_PAYMENT_EXP_MONTH: testId('field', 'payment form', 'exp_month'),
  FLD_FORM_PAYMENT_EXP_YEAR: testId('field', 'payment form', 'exp_year'),
  FLD_FORM_PAYMENT_CVV: testId('field', 'payment form', 'cvv'),
  FLD_FORM_PAYMENT_ZIP: testId('field', 'payment form', 'zip'),

  BTN_INVOKE_PAYMENT_MODAL: testId('button', 'invoke payment modal'),
  BTN_CHECKOUT_MODIFY_CART: testId('button', 'modify cart', 'checkout page'),
  BTN_CHECKOUT_REMOVE_ITEM: testId('button', 'remove item', 'checkout page'),
  BTN_CHECKOUT_REMOVE_ITEM_FN: testIdRest('button', 'remove item', 'checkout page'),

  CARD_CHECKOUT_ITEM: testId('card', 'item', 'checkout page'),
  CARD_CHECKOUT_ITEM_FN: testIdRest('card', 'item', 'checkout page'),

  TEXT_ORDER_ID_FN: testIdRest('text', 'orderId'),
  TEXT_ORDER_ID: testId('text', 'orderId')

}));
