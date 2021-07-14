import puppeteer from 'puppeteer';
import { InflightRequests, safeJSONValue } from './puppeteerExtensions';
import { safelyExecuteAsync } from '../src/shared/promises';
import { initializeNavigationContext } from './navigation';

export function setUpBrowserAndPage(testLifecycleHooks, context, viewport, setPage) {

  const { beforeAll, afterAll } = testLifecycleHooks;
  if (!beforeAll || !afterAll) {
    throw new Error('Essential test lifecycle hooks are not specified ("beforeAll", "afterAll")');
  }

  const { width, height } = viewport;

  let browser = null;
  let page = null;

  beforeAll(async () => {

    let launchErr;
    ([ launchErr, browser ] = await safelyExecuteAsync(puppeteer.launch({
      //      devtools: true,
      timeout: 0,
      headless: false,
      ignoreHTTPSErrors: true,
      slowMo: 2,
      args: [
        `--window-size=${ width },${ height }`,
        // FTGO_ENV:  dev - local machine
        process.env.FTGO_ENV === 'dev' ? '' : '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--disable-features=site-per-process',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
//        '--disable-web-security',
//        '--user-data-dir=~/.'
      ]
    })));
    if (launchErr || !browser) {
      throw new Error(`[ftgo-consumer-web-ui/tests-ui/browserSetup]: Puppeteer failed to produce a new instance of a browser when 'puppeteer.launch(..)'. Error: ${ launchErr?.message }`);
    }

    console.log(`Using Puppeteer Chromium version:`, await browser.version());

//    browser.on('disconnected', () => {
//      try {
//        console.log('Browser disconnected.');
//      } catch (_) {}
//    });

    browser.on('targetdestroyed', (e) => {
      try {
        console.log('Browser target destroyed event. Event:', e, ' Stack trace:', (new Error()).stack);
      } catch (_) {}
    });

    let pageErr;
    ([ pageErr, page ] = await safelyExecuteAsync(browser.newPage()));
    if (pageErr) {
      throw new Error(`[ftgo-consumer-web-ui/tests-ui/browserSetup]: Puppeteer failed to create a new page when 'browser.newPage()'. Error: ${ pageErr?.message }`);
    }

    Object.assign(context, { page });

    await page.setRequestInterception(true);
    page.on('request', request => request.continue());
    const requestsTracker = new InflightRequests(page);

    initializeNavigationContext({ requestsTracker });

    Object.assign(context, { requestsTracker });

    setPage && setPage(page);

    const consoleMsgs = [];
    Object.assign(context, { consoleMsgs });

    page.on('console', async ({ _type, _text, _args }) => {
      context.consoleMsgs.push([
        _type.padEnd(8), _text, ...(await Promise.all(_args.map(arg => safeJSONValue(arg)))).map(JSON.stringify)
      ]);
    });

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await page.setViewport(viewport); // width, height

  });

  afterAll(() => {
    if (context.requestsTracker) {
      context.requestsTracker.dispose();
    }
    browser && browser.close();
  });

  return page;
}
