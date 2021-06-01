import faker from 'faker';
import './ensure_env';
import { ensureEnvVariable } from '../src/shared/env';
import { getRandomEmail } from '../src/shared/email';

export function obtainTestInfo() {

  return {
    goodAddress: {
      address: `Testing Address: ${ faker.random.words(2) }`,
      timeRaw: new Date(new Date().setHours(0, 8)).toISOString()
    },
    email: getUniqueEmailAddressForTests()
    //phone: faker.phone.phoneNumber(),
    //message: faker.random.words()
  };
}

const testEmailAddress = ensureEnvVariable('FTGO_TEST_EMAIL_ADDRESS');

export function getUniqueEmailAddressForTests() {
  return getRandomEmail(testEmailAddress, () => faker.random.alphaNumeric(8));
}

/**
 * @description Source: https://www.mattzeunert.com/2020/04/01/filling-out-a-date-input-with-puppeteer.html
 * Transforms a date into a string for typing-in into the input box
 * @param page
 * @param testInfo
 * @return {Promise<void>}
 */
export async function ensureLocalizedTimeString(page, testInfo) {
  const timeRaw = testInfo.goodAddress.timeRaw;

  testInfo.goodAddress.time = (await page.evaluate(
    d => new Date(d).toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit'
    }),
    timeRaw
  )).replace(' ', '');

}
