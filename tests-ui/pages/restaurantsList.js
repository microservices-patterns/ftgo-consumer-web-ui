import { waitForSelector, waitForSelectorAndClick, waitForSelectorWithText } from '../puppeteerExtensions';
import { SEL } from '../selectors';
import { tagPageObject } from './utilities';
import { cssSel } from '../../src/shared/e2e/helpers';

export const restaurantsListPage = page => tagPageObject('restaurantsListPage', {
  expectVisitingSelf: () => waitForSelector(page, SEL.PAGE_RESTAURANTS_LIST),
  browseTheRestaurantsTableForSpecificEntryAndClickOnIt: async () => {

    await waitForSelector(page, SEL.TBL_RESTAURANTS_LIST);

    const paginationControlSel = cssSel(SEL.TBL_RESTAURANTS_LIST).desc(SEL.CTL_PAGINATION_FOR_TABLE);
    await waitForSelector(page, paginationControlSel);
    await waitForSelectorAndClick(page,
      paginationControlSel.desc('.page-item').attr('title', 'next page').child('a.page-link'));

    const el = await waitForSelectorWithText(page, 'td', 'All items');
    await el.click();

  },

});
