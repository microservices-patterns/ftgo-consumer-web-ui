import { safelyExecuteAsync } from '../../shared/promises';

const API_URL = '/api';

const apiRoutes = prepareRoutesForFetch({
  postAddressObtainRestaurants: [
    `POST ${ API_URL }/address`,
    (address, time, origin) => ({ address, time, origin })
  ],
  getRestaurantById: restaurantId => `${ API_URL }/restaurants/${ restaurantId }`
});

export const { postAddressObtainRestaurants, getRestaurantById } = apiRoutes;


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
