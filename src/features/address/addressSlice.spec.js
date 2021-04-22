// eslint-disable-next-line no-redeclare
/* global describe, expect, test */

import addressReducer, { keepAddressAndTime, resetAddressAndTime } from './addressSlice';

describe(`src/features/address/addressSlice.js`, () => {

  const initialState = {
    address: null,
    time: null,
    origin: null,
    status: 'idle',
    value: null,
    error: null,
    restaurants: expect.objectContaining({
      ids: expect.anything(),
      entities: expect.anything()
    })
  };

  test(`should handle initial state`, () => {
    expect(addressReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  const payload = { address: 'address', time: '10:00', now: (new Date() - 0) };

  test(`preserves address and time`, () => {
    const actual = addressReducer(initialState, keepAddressAndTime(payload));
    expect(actual.address).toEqual(payload.address);
    expect(actual.time).toEqual(payload.time);
    expect(actual.origin).toEqual(payload.now);
  });

  test(`restores initial state for address and time`, () => {
    const nextState = addressReducer(initialState, keepAddressAndTime(payload));
    const actual = addressReducer(nextState, resetAddressAndTime());

    expect(actual.address).toEqual(initialState.address);
    expect(actual.time).toEqual(initialState.time);
    expect(actual.origin).toEqual(initialState.origin);
  });

});
