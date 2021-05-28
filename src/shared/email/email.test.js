import { destructureEmail, DEFAULT_LABEL_PREFIX, getRandomizedEmailTemplate, DEFAULT_RANDOM_PLACEHOLDER, getRandomEmail } from './index';

describe('A set of utilities to dissect email addresses', () => {

  describe('destructureEmail()', () => {

    [
      [ 'a@a.com', [ 'a', DEFAULT_LABEL_PREFIX, 'a.com' ]],
      [ 'a+b@a.com', [ 'a', 'b', 'a.com' ]],
    ].filter(Boolean).forEach(([ input, [ expUserName, expLabel, expDomain ]]) => it(`can destructure '${ input }'`, () => {
      const { userName, label, domain } = destructureEmail(input);
      expect(userName).toEqual(expUserName);
      expect(label).toEqual(expLabel);
      expect(domain).toEqual(expDomain);
    }));

    it('throws for multilabel emails', () => {
      expect(() => destructureEmail('a++b@c.com')).toThrow();
      expect(() => destructureEmail('a+a+b@c.com')).toThrow();
    });

  });

  describe('getRandomizedEmailTemplate()', () => {
    [
      [ 'a@a.com', undefined,  `a+${ DEFAULT_LABEL_PREFIX }${ DEFAULT_RANDOM_PLACEHOLDER }@a.com` ],
      [ 'a@a.com', '',  `a+${ DEFAULT_LABEL_PREFIX }@a.com` ],
      [ 'a+a@a.com', undefined, `a+a${ DEFAULT_RANDOM_PLACEHOLDER }@a.com` ],
      [ 'a+a@a.com', '_b_', `a+a_b_@a.com` ],
    ].filter(Boolean).forEach(([ input, randomPlaceholder, expectedResult ]) => it(`can provide template for random email for '${ input }'`, () => {
      const result = getRandomizedEmailTemplate(input, randomPlaceholder);
      expect(result).toEqual(expectedResult);
    }));
  });

  describe('getRandomEmail()', () => {
    [
      [ 'a@a.com', undefined,  `a+${ DEFAULT_LABEL_PREFIX }@a.com` ],
      [ 'a@a.com', () => 'random',  `a+${ DEFAULT_LABEL_PREFIX }random@a.com` ],
      [ 'a+a@a.com', undefined, `a+a@a.com` ],
      [ 'a+a@a.com', () => 'random', `a+arandom@a.com` ],
    ].filter(Boolean).forEach(([ input, randomPartGetter, expectedResult ]) => it(`can create unique emails by supplying random part generator, tested on '${ input }'`, () => {
      const result = getRandomEmail(input, randomPartGetter);
      expect(result).toEqual(expectedResult);
    }));
  });

});
