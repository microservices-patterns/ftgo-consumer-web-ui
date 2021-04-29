export function fetchRestaurants(address, time, origin) {
  return new Promise((resolve, reject) =>
    setTimeout(() =>
      /[02468]$/.test(time) ?
        resolve({
          data: {
            address,
            time,
            origin,
            restaurants: (/[0]$/.test(time) ?
              [] :
              [
                // two entries
                {
                  'id': '121721',
                  'name': 'Nandos Banani',
                  'address': 'Road-11, Banani, Dhaka',
                  'delivery-fee': 75.00,
                  avgDeliveryTime: 60
                }, {
                'id': '6317637',
                'name': 'Le Petit Souffle',
                'address': 'Third Floor, Century City Mall, Kalayaan Avenue, Poblacion, Makati City',
                'delivery-fee': 75.00,
                avgDeliveryTime: 60
              },
                ...(/[68]$/.test(time) ? [
                  // 3 more entries
                  {
                    'id': '6304287',
                    'name': 'Izakaya Kikufuji',
                    'address': 'Little Tokyo, 2277 Chino Roces Avenue, Legaspi Village, Makati City',
                    'delivery-fee': 75.00,
                    avgDeliveryTime: 60
                  }, {
                    'id': '6300002',
                    'name': 'Heat - Edsa Shangri-La',
                    'address': 'Edsa Shangri-La, 1 Garden Way, Ortigas, Mandaluyong City\n',
                    'delivery-fee': 75.00,
                    avgDeliveryTime: 60
                  }, {
                    'id': '6318506',
                    'name': 'Ooma',
                    'address': 'Third Floor, Mega Fashion Hall, SM Megamall, Ortigas, Mandaluyong City',
                    'delivery-fee': 75.00,
                    avgDeliveryTime: 60
                  },
                ] : [])
              ])
          }
        }) :
        reject(({
          message: 'Form submission error',
          code: 500,
          errors: {
            time: 'Wrong time',
            address: 'Return to sender, address unknown'
          }
        })), 3000)
  );
}
