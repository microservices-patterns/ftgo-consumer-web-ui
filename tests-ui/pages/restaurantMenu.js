import { waitForSelector } from '../puppeteerExtensions';
import { SEL } from '../selectors';
import { tagPageObject } from './utilities';

export const restaurantMenuPage = page => tagPageObject('restaurantMenuPage', {
  expectVisitingSelf: () => waitForSelector(page, SEL.PAGE_RESTAURANT_MENU),

});
