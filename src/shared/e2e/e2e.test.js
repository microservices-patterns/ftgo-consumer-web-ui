import { e2eAttr, e2eSelector, pickHeadUntilNullish, prepareSelector, prepareSelectorOpen } from './helpers';

describe(`src/shared/e2e/helpers.js`, () => {
  describe(`pickHeadUntilNullish(arr:Array<string|empty>):Array<string>`, () => {
    [
      [ [], [], 'No args' ],
      [ [ 'modal' ], [ 'modal' ], 'single arg' ],
      [ [ 'modal', 'alert' ], [ 'modal', 'alert' ], 'two args' ],
      [ [ 'modal', 'alert', null ], [ 'modal', 'alert' ], 'three args with null in the end' ],
      [ [ 'modal', null, 'alert' ], [ 'modal' ], 'three args with null in the middle' ],
      [ [ null, 'modal', 'alert' ], [], 'three args with null at the start' ],
    ].filter(Boolean).map(([ args, expected, msg ], idx) =>
      test(`#${ 1 + idx }. ${ msg } `, () => {
        expect(pickHeadUntilNullish(args)).toEqual(expected);
      }));
  });

  describe(`prepareSelector(role, roleSpecifics, personalization):{function(arg:string): *}`, () => {
    [
      [ [], '', 'No args' ],
      [ [ 'modal' ], 'modal|', 'single arg' ],
      [ [ 'modal', 'alert' ], 'modal|alert|', 'two args' ],
      [ [ 'modal', 'alert', null ], 'modal|alert|', 'three args with null in the end' ],
      [ [ 'modal', null, 'alert' ], 'modal|', 'three args with null in the middle' ],
      [ [ null, 'modal', 'alert' ], '', 'three args with null at the start' ],
    ].filter(Boolean).map(([ args, expected, msg ], idx) =>
      test(`#${ 1 + idx }. ${ msg } `, () => {
        const K = arg => arg;
        expect(prepareSelector(...args)(K)).toEqual(expected);
      }));
  });

  describe(`prepareSelectorOpen(...args) => fn => (...args2) => *`, () => {
    [
      [ [], [], '', 'No args' ],
      [ [ 'modal' ], [], 'modal|', 'single arg' ],
      [ [ 'modal', 'alert' ], [], 'modal|alert|', 'two args' ],
      [ [ 'modal' ], [ 'alert' ], 'modal|alert|', 'two args' ],
      [ [ 'modal', 'alert', null ], [], 'modal|alert|', 'three args with null in the end (3-0)' ],
      [ [ 'modal', 'alert' ], [ null ], 'modal|alert|', 'three args with null in the end (2-1)' ],
      [ [ 'modal' ], [ 'alert', null ], 'modal|alert|', 'three args with null in the end (1-2)' ],
      [ [], [ 'modal', 'alert', null ], 'modal|alert|', 'three args with null in the end (0-3)' ],
      [ [ 'modal', null, 'alert' ], [], 'modal|', 'three args with null in the middle (3-0)' ],
      [ [ 'modal', null ], [ 'alert' ], 'modal|', 'three args with null in the middle (2-1)' ],
      [ [ 'modal' ], [ null, 'alert' ], 'modal|', 'three args with null in the middle (1-2)' ],
      [ [], [ 'modal', null, 'alert' ], 'modal|', 'three args with null in the middle (0-3)' ],
      [ [ null, 'modal', 'alert' ], [], '', 'three args with null at the start (3-0)' ],
      [ [ null, 'modal' ], [ 'alert' ], '', 'three args with null at the start (2-1)' ],
      [ [ null ], [ 'modal', 'alert' ], '', 'three args with null at the start (1-2)' ],
      [ [], [ null, 'modal', 'alert' ], '', 'three args with null at the start (0-3)' ],
    ].filter(Boolean).map(([ args, args2, expected, msg ], idx) =>
      test(`#${ 1 + idx }. ${ msg } `, () => {
        const K = arg => arg;
        expect(prepareSelectorOpen(...args)(K)(...args2)).toEqual(expected);
      }));
  });

  describe(`e2eAttr(sel:string):{'data-testid'}`, () => {
    [
      [ [], { 'data-testid': '' }, 'No args' ],
      [ [ 'modal' ], { 'data-testid': 'modal|' }, 'single arg' ],
      [ [ 'modal', 'alert' ], { 'data-testid': 'modal|alert|' }, 'two args' ],
      [ [ 'modal', 'alert', null ], { 'data-testid': 'modal|alert|' }, 'three args with null in the end' ],
      [ [ 'modal', null, 'alert' ], { 'data-testid': 'modal|' }, 'three args with null in the middle' ],
      [ [ null, 'modal', 'alert' ], { 'data-testid': '' }, 'three args with null at the start' ],
    ].filter(Boolean).map(([ args, expected, msg ], idx) =>
      test(`#${ 1 + idx }. ${ msg } `, () => {
        expect(prepareSelector(...args)(e2eAttr)).toEqual(expected);
      }));

  });
  describe(`e2eSelector(sel:string):string`, () => {
    [
      [ [], '[data-testid=""]', 'No args' ],
      [ [ 'modal' ], '[data-testid^="modal|"]', 'single arg' ],
      [ [ 'modal', 'alert' ], '[data-testid^="modal|alert|"]', 'two args' ],
      [ [ 'modal', 'alert', null ], '[data-testid^="modal|alert|"]', 'three args with null in the end' ],
      [ [ 'modal', null, 'alert' ], '[data-testid^="modal|"]', 'three args with null in the middle' ],
      [ [ null, 'modal', 'alert' ], '[data-testid=""]', 'three args with null at the start' ],
    ].filter(Boolean).map(([ args, expected, msg ], idx) =>
      test(`#${ 1 + idx }. ${ msg } `, () => {
        expect(prepareSelector(...args)(e2eSelector)).toEqual(expected);
      }));

  });
});
