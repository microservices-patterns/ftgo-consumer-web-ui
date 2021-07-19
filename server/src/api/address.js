import resource from 'resource-router-middleware';
import restaurants from '../models/address';
import { cache } from './cache';

const addressResource = ({ config, db }) => resource({

  /** Property name to store preloaded entity on `request`. */
  id: 'facet',

  /** GET / - List all entities */
  index({ params }, res) {
    res.json(restaurants);
  },

  /** POST / - Create a new entity */
  create(req, res) {

    const { body } = req;
    const { address, time } = body;
    if (!address || !time) {
      return res.status(400).json({
        message: `Missing field`,
        code: 400,
        errors: {
          ...(!time ? { time: 'Required' } : {}),
          ...(!address ? { address: 'Required' } : {}),
          ...(!origin ? { origin: 'Required' } : {}),
        }
      });
    }

    if (/[02468]$/.test(time)) {
      const result = [
        ...(/0$/.test(time) ? [] : (/[68]$/.test(time) ? restaurants : restaurants.slice(0, 2)))
      ];

      cache.del('cart');
      body.restaurants = result;
      res.json(body);
      return;
    }

    res.status(500).json({
      message: 'Form submission error',
      code: 500,
      errors: {
        time: 'Wrong time',
        address: 'Return to sender, address unknown'
      }
    });

  },

  /** GET /:id - Return a given entity */
  read({ facet }, res) {
    res.sendStatus(501);
  },

  /** PUT /:id - Update a given entity */
  update({ facet, body }, res) {
    res.sendStatus(501);
  },

  /** DELETE /:id - Delete a given entity */
  delete({ facet }, res) {
    res.sendStatus(501);
  }
});

export default addressResource;
