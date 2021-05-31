import faker from 'faker';
import './ensure_env';
import { ensureEnvVariable } from '../src/shared/env';
import { getRandomEmail } from '../src/shared/email';

export function obtainTestInfo() {

  const result = {
    goodAddress: {
      address: `Testing Address: ${ faker.random.words(2) }`,
      time: '10:58 PM'
    },
    email: getUniqueEmailAddressForTests()
    //phone: faker.phone.phoneNumber(),
    //message: faker.random.words()
  };
  return result;
}

const testEmailAddress = ensureEnvVariable('FTGO_TEST_EMAIL_ADDRESS');

export function getUniqueEmailAddressForTests() {
  return getRandomEmail(testEmailAddress, () => faker.random.alphaNumeric(8));
}
