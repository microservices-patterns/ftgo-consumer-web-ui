
describe(`src/features/address/addressAPI.test.js`, () => {

  const fetchRestaurants = () => {};
  describe.skip(`fetchRestaurants(address, time, now) - silly implementation (no network call)`, () => {

    afterAll(() => {
      jest.clearAllMocks();
    });

    const successfulResponse = {
      data: expect.objectContaining({
        address: expect.any(String),
        time: expect.any(String),
        origin: expect.any(Number),
        restaurants: expect.any(Array)
      })
    };

    const failingResponse = {
      message: expect.any(String),
      code: expect.any(Number),
      errors: expect.any(Object)
    };

    test(`returns a promise`, () => {

      expect(fetchRestaurants('address', '10:20')).toBeInstanceOf(Promise);
    });

    test(`successful response`, () => {
      // time ending even number - resolves to successful answer
      expect(fetchRestaurants('address', '10:20')).resolves.toEqual(successfulResponse);
    });

    test(`response with an error`, () => {
      // time ending odd number - resolves to server-side error + validation errors
      expect(fetchRestaurants('address', '10:21')).rejects.toEqual(failingResponse);
    });
    
  });

});
