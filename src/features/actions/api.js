import { safelyExecuteAsync } from '../../shared/promises';

const API_URL = (`${process.env.REACT_APP_BACKEND_API_URL}/api`).replace(/\/\/api$/i, '/api');

const apiRoutes = prepareRoutesForFetch({
  postAddressObtainRestaurants: [
    `POST ${ API_URL }/address`,
    (address, time, origin) => ({ address, time, origin })
  ],
  getRestaurantById: restaurantId => `${ API_URL }/restaurants/${ restaurantId }`,
  postCreateNewCart: `POST ${ API_URL }/cart`,
  putUpdateCartWithItem: [
    (cartId, restaurantId, itemId, qty) => `PUT ${ API_URL }/cart/${ cartId }`,
    (cartId, restaurantId, itemId, qty) => ({ cartId, restaurantId, itemId, qty })
  ]
});

export const { postAddressObtainRestaurants, getRestaurantById, putUpdateCartWithItem, postCreateNewCart } = apiRoutes;

function prepareRoutesForFetch(routes) {
  return Object.fromEntries(Array.from(Object.entries(routes), ([ k, v ]) => {
    const [ resource, init ] = Array.isArray(v) ? v : [ v ];
    return [ k, async (...args) => {
      const [ method, url ] = parseResource(resource, args);
      const [ fetchErr, response ] = await safelyExecuteAsync(fetch(typeof url === 'function' ? url(...args) : url, {
        method,
        ...(init ? { body: JSON.stringify(init(...args)) } : {}),
        headers: {
          'Content-Type': 'application/json'
        },
      }));

      if (fetchErr || !response.ok) {
        throw fetchErr || await response.json();
      }

      return response.json();
    }
    ];
  }));
}

function parseResource(input, args) {
  const parts = (((typeof input === 'function') ? input(...args) : input).split(/\s+/));
  return (parts.length === 1) ? [ 'GET', parts[ 0 ] ] : [ parts[ 0 ].toUpperCase(), parts[ 1 ] ];
}
