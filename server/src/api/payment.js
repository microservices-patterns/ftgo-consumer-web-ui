import { paymentIntentFakeStripeResponse } from './paymentIntentResponse';
import { cache } from './cache';
import { updateCartWithStats } from './cart';

// left this here intentionally
// ```js
//import stripeDefault from 'stripe';
//const stripe = stripeDefault(process.env.STRIPE_SK_KEY);
// ```

const aGeneralCCCardNumberPattern = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;

const paymentIntent = paymentIntentFakeStripeResponse;

export const postPaymentIntentHandler = (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  // ```js
  //		await stripe.paymentIntents.create({
  //			amount: calculateOrderAmount(items),
  //			currency: "usd"
  //		});
  // ```

  console.log('[paymentIntent]', paymentIntent);

  res.send({
    clientSecret: paymentIntent.client_secret,
    amount: calculateOrderAmount(items)
  });

};

export const postPaymentConfirmHandler = (req, res) => {

  const [ err, clientSecret, card ] = safelyDestructure(req.body,
    ({
       clientSecret,
       paymentMethod: {
         card
       }
     }) => ([ clientSecret, card ]));

  if (err) {
    console.log(err);
    return res.status(400).json({ error: { message: 'invalid parameters in the request' } });
  }

  console.log('[stripe-ish.confirmCardPayment]', clientSecret, card);

  if (clientSecret !== paymentIntent.client_secret) {
    console.log('payment intent client secret mismatch');
    return res.status(400).json({ error: { message: 'payment intent client secret mismatch' } });
  }

  if (!aGeneralCCCardNumberPattern.test(card?.card_number ?? '')) {
    return res.status(400).json({ error: { message: 'Invalid card number' }, errors: { card_number: 'Invalid' } });
  }

  if (!card?.exp_year || !card?.exp_month) {
    return res.json({
      error: { message: 'Expiration (MM/YY) is required' }, errors: {
        ...(!card?.exp_year ? { exp_year: 'Required' } : {}),
        ...(!card?.exp_month ? { exp_month: 'Required' } : {})
      }
    }).status(400);
  }

  if ((Number(card?.exp_year ?? '00') < (new Date().getFullYear() % 100)) || (
    (Number(card?.exp_year ?? '00') === (new Date().getFullYear() % 100)) &&
    (Number(card?.exp_month ?? '00') < (new Date().getMonth() % 12 + 1))
  )) {
    return res.json({
      error: { message: 'Card is expired.' },
      errors: { exp_month: 'Invalid', exp_year: 'Invalid' }
    }).status(400);
  }

  if (!card?.cvv) {
    return res.json({ error: { message: 'CVV is required' }, errors: { cvv: 'Required' } }).status(400);
  }


  // 4242 4242 4242 4242 - Payment succeeds
  // 4000 0025 0000 3155 - Payment requires authentication
  // 4000 0000 0000 9995 - Payment is declined

  if (/^4242\s*4242\s*4242\s*4242$/.test(card?.card_number ?? '')) {
    return respondWithSuccessfulPayment(res);
  } else if (/^4000\s*0025\s*0000\s*3155$/.test(card?.card_number ?? '')) {
    const isOdd = (new Date().getTime() % 2) === 0;
    return setTimeout(() => {
      if (isOdd) {
        return res.json({
          error: { message: 'Payment requires authentication. The odds now are for simulating an error. Try again for successful payment.' },
          errors: { card_number: 'Bank requested authentication.' }
        }).status(400);
      } else {
        return respondWithSuccessfulPayment(res);
      }
    }, 3500);
  } else if (/^4000\s*0000\s*0000\s*9995$/.test(card?.card_number ?? '')) {
    return setTimeout(() => {
      return res.status(400).json({ error: { message: 'Payment is declined' } });
    }, 2000);
  } else {
    return respondWithSuccessfulPayment(res);
  }

};

function respondWithSuccessfulPayment(res) {
  cache.del('cart');

  return setTimeout(() => {
    return res.status(200).json({ success: true });
  }, 1000);
}


function safelyDestructure(source, destructor) {
  try {
    return [ null, ...destructor(source) ];
  } catch (err) {
    return [ err ];
  }
}


const calculateOrderAmount = items => {
  const cart = updateCartWithStats({ items });
  const { total } = cart;
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  console.log(`[calculateOrderAmount]`, JSON.stringify(cart, null, 2));
  return total;
};
