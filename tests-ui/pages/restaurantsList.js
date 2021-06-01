import { waitForSelector, waitForSelectorAndClick, waitForSelectorWithText } from '../puppeteerExtensions';
import { SEL } from '../selectors';
import { tagPageObject } from './utilities';

export const restaurantsListPage = page => tagPageObject('restaurantsListPage', {
  expectVisitingSelf: () => waitForSelector(page, SEL.PAGE_RESTAURANTS_LIST),
  browseTheRestaurantsTableForSpecificEntryAndClickOnIt: async () => {

    await waitForSelector(page, SEL.TBL_RESTAURANTS_LIST);
    await waitForSelector(page, `${ SEL.TBL_RESTAURANTS_LIST } ${ SEL.CTL_PAGINATION_FOR_TABLE }`);
    await waitForSelectorAndClick(page, `${ SEL.TBL_RESTAURANTS_LIST } ${ SEL.CTL_PAGINATION_FOR_TABLE } .page-item[title="2"]>a.page-link`);

    const el = await waitForSelectorWithText(page, 'td', 'All items');
    await el.click();

  },

});
