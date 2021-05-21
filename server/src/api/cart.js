import resource from 'resource-router-middleware';

const initialCart = {
  name: 'new cart'
};

const inMemoCart = {
  current: null
};

const facetName = 'cart';

const cartResource = ({ config, db }) => resource({
  /** Property name to store preloaded entity on `request`. */
  id: facetName,

  /** POST / - Create a new entity */
  create(req, res) {
    if (!inMemoCart.current) {
      inMemoCart.current = Object.assign({}, initialCart, {
        id: String(new Date().getTime()),
        items: []
      });
    }

    res.json(inMemoCart.current);
  },

  /** PUT /:id - Update a given entity */
  update({ [facetName]: facet, body }, res) {

    console.log(facet, body);
    debugger;

    res.sendStatus(501);
  },
});

export default cartResource;
