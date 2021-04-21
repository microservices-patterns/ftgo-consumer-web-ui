export function fetchRestaurants(address, time, now) {
  return new Promise((resolve, reject) =>
    setTimeout(() =>
      /[02468]$/.test(time) ?
        resolve({ data: { address, time, now, list: [] } }) :
        reject(({
          message: 'Form submission error',
          code: 500,
          errors: {
            time: 'Wrong time',
            address: 'Return to sender, address unknown'
          }
        })), 5000)
  );
}
