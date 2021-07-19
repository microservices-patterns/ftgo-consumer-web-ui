import { safelyExecuteAsync } from '../../shared/promises';
import { ensureEnvVariable } from '../../shared/env';

const API_URL = ensureEnvVariable('REACT_APP_BACKEND_API_URL', window.location.origin);

const urlResolver = obtainFQDNUrl(API_URL, window.location);

const apiRoutes = prepareRoutesForFetch({
  postAddressObtainRestaurants: [
    `POST /cart/address`,
    (address, time) => ({ address, time })
  ],
  getRestaurantById: restaurantId => `/restaurants/${ restaurantId }`,
  getCart: `GET /cart`,
  putUpdateCartWithItem: [
    `PUT /cart/0`,
    (restaurantId, itemId, quantity) => ({ restaurantId, itemId, quantity })
  ],
  postCreatePaymentIntent: [
    `POST /payment/intent`,
    (items) => ({ items })
  ],
  postConfirmPayment: [
    `POST /payment/confirm`,
    (clientSecret, card) => ({ clientSecret, paymentMethod: { card } })
  ]
}, urlResolver);

export const {
  postAddressObtainRestaurants, getRestaurantById, putUpdateCartWithItem,
  getCart, postCreatePaymentIntent, postConfirmPayment
} = apiRoutes;

function prepareRoutesForFetch(routes, urlResolver) {
  return Object.fromEntries(Array.from(Object.entries(routes), ([ k, v ]) => {
    const [ resource, init ] = Array.isArray(v) ? v : [ v ];
    return [ k, async (...args) => {
      const [ method, url ] = parseResource(resource, args, urlResolver);
      const [ fetchErr, response ] = await safelyExecuteAsync(fetch(typeof url === 'function' ? url(...args) : url, {
        method,
        ...(init ? { body: JSON.stringify(init(...args)) } : {}),
        mode: 'cors', // no-cors, *cors, same-origin
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

function parseResource(input, args, urlResolver) {
  const parts = (((typeof input === 'function') ? input(...args) : input).split(/\s+/));
  return (parts.length === 1) ? [ 'GET', urlResolver(parts[ 0 ]) ] : [ parts[ 0 ].toUpperCase(), urlResolver(parts[ 1 ]) ];
}

function obtainFQDNUrl(baseUrl, location) {
  const resolvedLocation = resolveBaseUrl(baseUrl, location);
  resolvedLocation.pathname = 'api';
  const resolvedAPILocation = resolvedLocation.toString();

  return pathPart =>
    [
      resolvedAPILocation,
      pathPart
    ].join('/').replace(`${ resolvedAPILocation }//`, `${ resolvedAPILocation }/`);
}

function resolveBaseUrl(baseUrl, location) {
  try {
    const result = new window.URL(baseUrl);
    if (result.origin == null) {
      return new URL(`${ location.protocol }${ baseUrl }`);
    }
    return result;
  } catch (ex) {
    return new URL(`${ location.protocol }${ baseUrl }`);
  }
}
