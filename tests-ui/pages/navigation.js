import { navigateToWithinApp } from '../navigation';
import { waitForTimeout } from '../puppeteerExtensions';
import { tagPageObject } from './utilities';

export const navigation = page => tagPageObject('navigation', {

  visitTheSite: async () => {
    await navigateToWithinApp(page, '/');
    await waitForTimeout(page, 1000);
  }

});
