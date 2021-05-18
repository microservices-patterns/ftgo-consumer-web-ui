import resource from 'resource-router-middleware';
import restaurants from '../models/address';
import menu from '../models/menu';

const facetName = 'restaurant';

const restaurantsMenuResource = ({ config, db }) => resource({

  /** Property name to store preloaded entity on `request`. */
  id: facetName,

  /** GET / - List all entities */
  index({ params }, res) {
    res.sendStatus(501);
  },

  /** POST / - Create a new entity */
  create(req, res) {
    res.sendStatus(501);
  },

  /** GET /:id - Return a given entity */
  read(req, res) {
    const { [ facetName] : id  } = req.params;
    if (String(id) === '0') {

      res.status(500).json({
        message: '/api/restaurants/0 - test API rejection',
        code: 500
      });

      return;
    }

    const result = restaurants.find(r => String(r.id) === String(id));
    if (!result) {
      return res.status(404).json({ message: 'Not found', code: 404 });
    }
    const effectiveMenu = /0$/.test(id) ?
      [] :
      (/[89]$/.test(id) ?
        menu :
        menu.filter(m => /[1357]$/.test(m.id) === /[1357]$/.test(id)));
    res.json(Object.assign(result, { menu: effectiveMenu }));
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

export default restaurantsMenuResource;
