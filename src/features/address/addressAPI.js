export function fetchRestaurants(address, time, origin) {
  debugger;
  return new Promise((resolve, reject) =>
    setTimeout(() =>
      /[02468]$/.test(time) ?
        resolve({ data: { address, time, origin, restaurants:
              [
                // two entries
                {
                  id: '',
                  title: '',
                  address: '',
                  category: '',
                  distance: '',
                  deliveryTime: 0
                },{
                  id: '',
                  title: '',
                  address: '',
                  category: '',
                  distance: '',
                  deliveryTime: 0
                },
                ...(/[79]$/.test(time) ? [
                  // 3 more entries
                  {
                    id: '',
                    title: '',
                    address: '',
                    category: '',
                    distance: '',
                    deliveryTime: 0
                  },{
                    id: '',
                    title: '',
                    address: '',
                    category: '',
                    distance: '',
                    deliveryTime: 0
                  },{
                    id: '',
                    title: '',
                    address: '',
                    category: '',
                    distance: '',
                    deliveryTime: 0
                  },
                ] : [])
              ]
        } }) :
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
