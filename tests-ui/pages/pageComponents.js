//await addressField(page).enter(testData.address);

import { element, textField } from '../helpers';
import { SEL } from '../selectors';

export const addressField = page => textField(page, SEL.FORM_FIELD_ADDRESS);
export const timeField = page => textField(page, SEL.FORM_FIELD_TIME);
export const addressAndTimeForm = page => element(page, SEL.FORM_PICK_ADDRESS_TIME)
export const addressAndTimeFormSubmitButton = page => element(page, SEL.BTN_SUBMIT_FORM_PICK_ADDRESS_TIME);
export const spinIcon = page => element(page, SEL.ICON_SPIN);
