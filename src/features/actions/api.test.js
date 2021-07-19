import { getRestaurantById, postAddressObtainRestaurants } from './api';

describe(`src/features/actions/api.test.js`, () => {

  afterEach(() => {
    global.fetch.resetMocks();
  });

  describe(`postAddressObtainRestaurants()`, () => {
    beforeEach(() => {
      global.fetch.mockResponseOnce(JSON.stringify({
        time: '10:10',
        origin: 12355,
        address: 'address',
        restaurants: []
      }));
    });
    test(`postAddressObtainRestaurants`, () => {
      expect(postAddressObtainRestaurants({
        time: '10:10', origin: 12355, address: 'address'
      })).resolves.toBeTruthy();
    });
  });
  describe(`getRestaurantById()`, () => {
    beforeEach(() => {
      global.fetch.mockResponseOnce(JSON.stringify({ id: '1234', menu: [] }));
    });
    test(`getRestaurantById`, () => {
      expect(getRestaurantById({
        time: '10:10', origin: 12355, address: 'address'
      })).resolves.toBeTruthy();
    });
  });
});
