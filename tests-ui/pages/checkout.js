import { tagPageObject } from './utilities';
import { waitForSelector } from '../puppeteerExtensions';
import { SEL } from '../selectors';


export const checkoutPage = page => tagPageObject('checkoutPage', {

  expectVisitingSelf: () => waitForSelector(page, SEL.PAGE_CHECKOUT),

});
