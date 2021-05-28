import { getEnvVar } from './envGetter';
import { ensureEnvVariable, ensureEnvVariables } from './index';

jest.mock('./envGetter');

const ref = {
  current: null
};

getEnvVar.mockImplementation((...args) => ref.current && ref.current(...args))

describe('A set of utilities to check presence of env variables', () => {

  beforeAll(() => {
    ref.current = key => ({
      'DEFINED': 'true',
      'DEFINED2': '2'
    })[ key ];
  });

  describe('ensureEnvVariable()', () => {

    test('Checks the existence of an env variable and returns its value', () => {
      expect(ensureEnvVariable('DEFINED')).toEqual('true');
      expect(ensureEnvVariable('DEFINED2')).toEqual('2');
    });

    test('Throws if a variable is not defined', () => {
      expect(() => ensureEnvVariable('UN-DEFINED')).toThrow();
    });

    test('Returns the supplied default value (even falsey) if a variable is not defined', () => {
      expect(ensureEnvVariable('UN-DEFINED-2', 2)).toEqual(2);
      expect(ensureEnvVariable('UN-DEFINED-0', 0)).toEqual(0);
      expect(ensureEnvVariable('UN-DEFINED-false', false)).toEqual(false);
      expect(ensureEnvVariable('UN-DEFINED-empty', '')).toEqual('');
    });

  });

  describe('ensureEnvVariables()', () => {

    test('Can check several env variables at once, returning an array of their values', () => {
      expect(ensureEnvVariables([ 'DEFINED', 'DEFINED2' ])).toEqual([ 'true', '2' ]);
    });

    test('Throws if any of the requested variables are not defined, error message contains missing variable names', () => {
      expect(() => ensureEnvVariables([ 'UN-DEFINED', 'UN-DEFINED2', 'DEFINED' ])).toThrow(/(UN-DEFINED.+UN-DEFINED2)|(UN-DEFINED2.+UN-DEFINED)/);
    });

    test('Returns the supplied default value for the corresponding index', () => {
      expect(ensureEnvVariables(
        [ 'DEFINED', 'UN-DEFINED-2', 'UN-DEFINED-0', 'UN-DEFINED-false', 'UN-DEFINED-empty'
        ],
        [ undefined, 2, 0, false, '' ]
      )).toEqual([ 'true', 2, 0, false, '' ]);
    });

  });

});
