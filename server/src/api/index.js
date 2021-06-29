import { version } from '../../package.json';
import { Router } from 'express';
import addresses from './address';
import restaurants from './restaurant';
import cart from './cart';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/cart/address', addresses({ config, db }));
	api.use('/cart', cart({ config, db }));
	api.use('/restaurants', restaurants({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
