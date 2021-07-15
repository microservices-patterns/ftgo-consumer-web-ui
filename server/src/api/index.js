//import { version } from '../../package.json';
import { Router } from 'express';
import addresses from './address';
import restaurants from './restaurant';
import cart from './cart';
import { postPaymentConfirmHandler, postPaymentIntentHandler } from './payment';

const defaultExport = ({ config, db }) => {
  let api = Router();

  // mount the facets resource
  api.use('/cart/address', addresses({ config, db }));
  api.use('/cart', cart({ config, db }));
  api.use('/restaurants', restaurants({ config, db }));

  api.post('/payment/intent', postPaymentIntentHandler);
  api.post('/payment/confirm', postPaymentConfirmHandler);


  // perhaps expose some API metadata at the root
  api.get('/', (req, res) => {
    res.json({ version: '1.0.0' });
  });

  return api;
};

export default defaultExport;
