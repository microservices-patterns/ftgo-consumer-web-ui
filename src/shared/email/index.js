export const DEFAULT_LABEL_PREFIX = 'maa-test-';
export const DEFAULT_RANDOM_PLACEHOLDER = '[RANDOM]';

export function destructureEmail(emailAddress, fn = K => K) {
  const [ userName, domain ] = emailAddress.split('@');
  const [ realUserName, label, ...byproduct ] = userName.split(/\+/);
  if (byproduct.length) {
    throw new Error(`The email address has more than one label.`);
  }
  return fn({ userName: realUserName, label: label || DEFAULT_LABEL_PREFIX, domain });
}

export function getRandomizedEmailTemplate (emailAddress, randomPlaceholder = DEFAULT_RANDOM_PLACEHOLDER) {
  return destructureEmail(emailAddress, ({ userName, label, domain }) => `${ userName }+${ label }${ randomPlaceholder }@${ domain }`);
}

export function getRandomEmail(emailAddress, randomPartGetter = () => '') {
  return getRandomizedEmailTemplate(emailAddress, randomPartGetter());
}