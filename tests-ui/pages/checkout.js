import { tagPageObject } from './utilities';
import { waitForSelector, waitForTimeout } from '../puppeteerExtensions';
import { SEL } from '../selectors';
import { element, textField } from '../helpers';
import { makeSafelyRunAsyncFn } from '../../src/shared/promises';
import { thankYouPage } from './thankYou';

const cartItem = page => element(page, SEL.CARD_CHECKOUT_ITEM);
const payButtonWhichInvokesModal = page => element(page, SEL.BTN_INVOKE_PAYMENT_MODAL);
//const editCartButton = page => element(page, SEL.BTN_CHECKOUT_MODIFY_CART);
//const removeItemFormCartButton = page => element(page, SEL.BTN_CHECKOUT_REMOVE_ITEM);
//const removeItemFormCartByItemButton = (page, itemName) => element(page, SEL.BTN_CHECKOUT_REMOVE_ITEM_FN(itemName));
const paymentModal = page => element(page, SEL.MODAL_PAYMENT);
const paymentForm = page => element(page, SEL.FORM_PAYMENT);
const paymentFormSubmitButton = page => element(page, SEL.BTN_FORM_PAYMENT_SUBMIT);
const paymentModalDismissButton = page => element(page, SEL.BTN_MODAL_PAYMENT_DISMISS_GENERAL);
const paymentModalDismissButtonAfterSuccessfulPayment = page => element(page, SEL.BTN_MODAL_PAYMENT_DISMISS);
const paymentModalDismissButtonBeforeSuccessfulPayment = (page) => element(page, SEL.BTN_MODAL_PAYMENT_CANCEL);

const textErrors = page => element(page, SEL.TEXT_FORM_PAYMENT_ERRORS);
const textSuccess = page => element(page, SEL.TEXT_FORM_PAYMENT_SUCCESS);

const inpCardNumber = page => textField(page, SEL.FLD_FORM_PAYMENT_CARD_NUMBER);
const inpExpMonth = page => textField(page, SEL.FLD_FORM_PAYMENT_EXP_MONTH);
const inpExpYear = page => textField(page, SEL.FLD_FORM_PAYMENT_EXP_YEAR);
const inpCvv = page => textField(page, SEL.FLD_FORM_PAYMENT_CVV);
const inpZip = page => textField(page, SEL.FLD_FORM_PAYMENT_ZIP);

export const checkoutPage = (page, expect) => tagPageObject('checkoutPage', {

  expectVisitingSelf: () => waitForSelector(page, SEL.PAGE_CHECKOUT),

  justWaitABit: () => waitForTimeout(page, 1000),

  expectCartNotEmptyAndReadyToPay: async () => {
    const cartItemsCount = await cartItem(page).count();
    console.log(`[cartItemsCount]`, cartItemsCount);
    expect && expect(cartItemsCount).toBeGreaterThanOrEqual(1);
  },

  bringUpThePaymentModal: async () => {
    const isNotPresent = await paymentModal(page).expectAbsent();
    if (isNotPresent) {
      await payButtonWhichInvokesModal(page).ensurePresent();
      await payButtonWhichInvokesModal(page).click();
    }

    await paymentModal(page).ensurePresent();
  },

  dismissThePaymentModal: async () => {
    const isPresent = !await paymentModal(page).expectAbsent();
    if (isPresent) {
      await paymentModalDismissButton(page).ensurePresent();
      await paymentModalDismissButton(page).click();
    }

    await paymentModalDismissButton(page).expectAbsent();

    const isAbsent = await paymentModal(page).expectAbsent();
    expect && expect(isAbsent).toEqual(true);

    await paymentModalDismissButton(page).expectAbsent();

  },

  playWithThePaymentModal: async () => {

    await paymentModal(page).expectAbsent();
    await paymentModalDismissButton(page).expectAbsent();

    await payButtonWhichInvokesModal(page).ensurePresent();
    await payButtonWhichInvokesModal(page).click();

    await paymentModal(page).ensurePresent();
    await paymentModalDismissButton(page).ensurePresent();
    await paymentModalDismissButtonBeforeSuccessfulPayment(page).ensurePresent();
    await paymentModalDismissButtonAfterSuccessfulPayment(page).expectAbsent();

    await paymentModalDismissButton(page).click();

    await paymentModal(page).expectAbsent();
    await paymentModalDismissButton(page).expectAbsent();

  },

  playWithThePaymentFormRequireds: async () => {
    await checkoutPage(page, expect).bringUpThePaymentModal();

    await paymentFormComponent(page, expect).tryAndTypeNothing();
    await paymentFormComponent(page, expect).wrongCCNumber();
    await paymentFormComponent(page, expect).correctCCNumberBlankExpiration();
    await paymentFormComponent(page, expect).correctCCNumberExpiredDateExpiration();
    await paymentFormComponent(page, expect).correctCCNumberCorrectExpirationBlankCvv();

    await checkoutPage(page, expect).dismissThePaymentModal();
  },

  attemptDeclinedCard: async () => {
    await checkoutPage(page, expect).bringUpThePaymentModal();
    await paymentFormComponent(page, expect).correctDeclinedCCNumberRestCorrectlyFilled();
    await checkoutPage(page, expect).dismissThePaymentModal();
  },

  attemptValidOkCard: async () => {
    await checkoutPage(page, expect).bringUpThePaymentModal();
    await paymentFormComponent(page, expect).correctAcceptedCard();

    await thankYouPage(page, expect).expectVisitingSelf();
  },

  submitPaymentForm: async (ignoreSubmitDisabled) => {
    await paymentFormSubmitButton(page).ensurePresent();
    await paymentFormSubmitButton(page).expectNotDisabled();
    await paymentFormSubmitButton(page).click();
    const [ err ] = await makeSafelyRunAsyncFn(async () => {
      await paymentFormSubmitButton(page).has(SEL.ICON_SPIN);
      await paymentFormSubmitButton(page).expectDisabled({ timeout: 5000 });
    })();
    if (err) {
      console.warn('[submitPaymentForm] paymentFormSubmitButton wasn\'t disabled as expected. Possibly the server request was too quick');
    }
    if (ignoreSubmitDisabled) {
      return;
    }
    await paymentFormSubmitButton(page).expectNotDisabled();
  },

});


const CARD_DECLINED = '4000 0000 0000 9995';
const CARD_ACCEPTED = '4242 4242 4242 4242';

export const paymentFormComponent = (page, expect) => tagPageObject('paymentFormComponent', {

  tryAndTypeNothing: async () => {
    // 1.
    await paymentForm(page).ensurePresent();
    await checkoutPage(page, expect).justWaitABit(); // nothing
    await paymentFormSubmitButton(page).ensurePresent();
    await paymentFormSubmitButton(page).expectDisabled();
    // 1. pass
  },

  wrongCCNumber: async () => {
    // 2. wrong CC number
    await inpCardNumber(page).ensurePresent();
    await inpCardNumber(page).enter('123');
    await checkoutPage(page, expect).submitPaymentForm();
    await textSuccess(page).expectAbsent();
    await textErrors(page).ensurePresent();
    await inpCardNumber(page).expectInvalid();
    // 2. pass
  },
  correctCCNumberBlankExpiration: async () => {
    // 3. correct CC number, blank expiration
    await inpCardNumber(page).ensurePresent();
    await inpCardNumber(page).enter(CARD_DECLINED, true);

    await checkoutPage(page, expect).submitPaymentForm();

    // error, expiration required
    await paymentFormComponent(page, expect).expectCardNumberCorrectExpirationInvalid();

    // 3. pass
  },
  correctCCNumberExpiredDateExpiration: async () => {
    // 4. correct CC number, filled expiration, expired
    await inpCardNumber(page).ensurePresent();
    await inpCardNumber(page).enter(CARD_DECLINED, true);
    await inpExpMonth(page).enter('10', true);
    await inpExpYear(page).enter('10', true);
    await checkoutPage(page, expect).submitPaymentForm();

    // error, expired
    await paymentFormComponent(page, expect).expectCardNumberCorrectExpirationInvalid();
    // 4. pass
  },

  expectCardNumberCorrectExpirationInvalid: async () => {
    await textSuccess(page).expectAbsent();
    await textErrors(page).ensurePresent();
    await inpCardNumber(page).expectNotInvalid();
    await inpExpMonth(page).expectInvalid();
    await inpExpYear(page).expectInvalid();
  },

  correctCCNumberCorrectExpirationBlankCvv: async () => {
    // 5. correct CC number, correct expiration, missing cvv
    await inpCardNumber(page).ensurePresent();
    await inpCardNumber(page).enter(CARD_DECLINED, true);
    await inpExpMonth(page).enter('10', true);
    await inpExpYear(page).enter('30', true);
    await checkoutPage(page, expect).submitPaymentForm();

    // error, expired
    await paymentFormComponent(page, expect).expectErrorButAllFieldsValid();

    await inpCvv(page).expectInvalid();
    // 5. pass
  },

  expectErrorButAllFieldsValid: async () => {
    await textSuccess(page).expectAbsent();
    await textErrors(page).ensurePresent();
    await inpCardNumber(page).expectNotInvalid();
    await inpExpMonth(page).expectNotInvalid();
    await inpExpYear(page).expectNotInvalid();
  },

  allCorrectlyFilled: async () => {
    await inpExpMonth(page).enter('10', true);
    await inpExpYear(page).enter('30', true);
    await inpCvv(page).enter('123', true);
    await inpZip(page).enter('12345', true);
  },

  correctDeclinedCCNumberRestCorrectlyFilled: async () => {
    // all correct, card declined
    await inpCardNumber(page).enter(CARD_DECLINED, true);

    await paymentFormComponent(page, expect).allCorrectlyFilled();
    await checkoutPage(page, expect).submitPaymentForm();

    await paymentFormComponent(page, expect).expectErrorButAllFieldsValid();

    await inpCvv(page).expectNotInvalid();
    await inpZip(page).expectNotInvalid();
  },

  correctAcceptedCard: async () => {
    // all correct, card accepted
    await inpCardNumber(page).enter(CARD_ACCEPTED, true);
    await paymentFormComponent(page, expect).allCorrectlyFilled();
    await checkoutPage(page, expect).submitPaymentForm(true);

    await textSuccess(page).ensurePresent();
    await textErrors(page).expectAbsent();

    await inpCardNumber(page).expectNotInvalid();
    await inpExpMonth(page).expectNotInvalid();
    await inpExpYear(page).expectNotInvalid();
    await inpCvv(page).expectNotInvalid();
    await inpZip(page).expectNotInvalid();

    await paymentFormSubmitButton(page).expectDisabled();

    await paymentModalDismissButtonAfterSuccessfulPayment(page).ensurePresent();
    await paymentModalDismissButtonAfterSuccessfulPayment(page).expectNotDisabled();
    await paymentModalDismissButtonAfterSuccessfulPayment(page).click();

  },
});
