import { version } from '../../package.json';
import { Router } from 'express';
import addresses from './address';
import restaurants from './restaurant';
import cart from './cart';
import stripeDefault from 'stripe';

const stripe = stripeDefault(process.env.STRIPE_SK_KEY);

const calculateOrderAmount = items => {
	// Replace this constant with a calculation of the order's amount
	// Calculate the order total on the server to prevent
	// people from directly manipulating the amount on the client
	console.log(`[calculateOrderAmount]`, JSON.stringify(items, null, 2));
	return 1400;
};


export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/cart/address', addresses({ config, db }));
	api.use('/cart', cart({ config, db }));
	api.use('/restaurants', restaurants({ config, db }));

	api.post("/payment/intent", async (req, res) => {
		const { items } = req.body;
		// Create a PaymentIntent with the order amount and currency
		const paymentIntent = await stripe.paymentIntents.create({
			amount: calculateOrderAmount(items),
			currency: "usd"
		});

		console.log('[paymentIntent]', paymentIntent);

		res.send({
			clientSecret: paymentIntent.client_secret
		});
	});


	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
