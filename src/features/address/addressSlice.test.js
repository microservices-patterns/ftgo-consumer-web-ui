// eslint-disable-next-line no-redeclare
/* global describe, expect, test */

import addressReducer, { keepAddressAndTime, resetAddressAndTime, retrieveRestaurantsForAddress } from './addressSlice';


describe(`src/features/address/addressSlice.js`, () => {

  const fetchRestaurantsMocked = jest.fn()

  afterAll(() => {
  });

  describe.skip(`addressReducer + keepAddressAndTime, resetAddressAndTime actions`, () => {

    const initialState = {
      address: null,
      time: null,
      origin: null,
      status: 'idle',
      value: null,
      error: null,
      restaurantsArr: null,
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

  describe.skip(`retrieveRestaurantsForAddress()`, () => {

    const dispatch = jest.fn();
    const getState = jest.fn();
    const useDispatch = jest.fn(fn => fn(dispatch, getState));

    beforeAll(() => {
      jest.useFakeTimers();
    });
    afterAll(() => {
      jest.useRealTimers();
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    test(`Calls real fetch/xhr function to retrieve data - receives data`, async () => {

      fetchRestaurantsMocked.mockImplementation(() => {});

      const result = useDispatch(retrieveRestaurantsForAddress({}));

      expect(dispatch).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(fetchRestaurantsMocked).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Promise);
      jest.advanceTimersToNextTimer();
      try {
        await result;
      } catch {}
      expect(result).resolves.toEqual(expect.any(Object));
      expect(dispatch).toHaveBeenCalledTimes(5);

      expect(dispatch.mock.calls).toEqual(
        Array.from({ length: 5 }, () =>([ expect.any(Object) ])));

      const dispatchedTypes = dispatch.mock.calls.map(([ arg ]) => arg.type);
      expect(dispatchedTypes).toEqual(expect.arrayContaining([
        expect.stringMatching('pending'),
        expect.stringMatching('keepAddressAndTime'),
        expect.stringMatching('keepRestaurants'),
        expect.stringMatching('router'),
        expect.stringMatching('fulfilled'),
      ]))

    });

    test(`Calls real fetch/xhr function to retrieve data - handles errors`, async () => {

      fetchRestaurantsMocked.mockImplementation(() => Promise.reject({}));

      const result = useDispatch(retrieveRestaurantsForAddress({ time: '10:11' }));
      expect(dispatch).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(fetchRestaurantsMocked).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Promise);
      jest.advanceTimersToNextTimer();
      try {
        await result;
      } catch {}
      expect(result).resolves.toEqual(expect.any(Object));
      expect(dispatch).toHaveBeenCalledTimes(2);


    });


  });
});
