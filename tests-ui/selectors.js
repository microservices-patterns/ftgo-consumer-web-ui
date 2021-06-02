import { SEL as selBase } from '../src/shared/e2e';

export const MOD = {
//  ARIA_EXPANDED: `[aria-haspopup=true][aria-expanded=true]`,
  ATTR_NOT_DISABLED: ':not([disabled])',
  ATTR_DISABLED: '[disabled]',
};

export const SEL = Object.assign({}, selBase, {});
