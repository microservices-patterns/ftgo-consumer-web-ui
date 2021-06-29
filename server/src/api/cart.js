import resource from 'resource-router-middleware';

const initialCart = {};

const inMemoCart = {
  current: null
};

const facetName = 'cart';

const cartResource = ({ config, db }) => resource({
  /** Property name to store preloaded entity on `request`. */
  id: facetName,

  index({ params }, res) {
    inMemoCart.current = Object.assign({}, initialCart, {
      subtotal: 0.0,
      items: []
    });

    res.json(inMemoCart.current);
  },


  /** PUT /:id - Update a given entity */
  update({ body, ...req }, res) {

    const id = req.params[ facetName ];
    console.log(id, body);
    debugger;

    if (inMemoCart.current) {
      const idx = inMemoCart.current.items.findIndex(item => item.id === id);
      if (idx < 0) {
        const result = {
          id,
          count: body.qty,
          restaurantId: body.restaurantId
        };
        inMemoCart.current.items = [
          ...inMemoCart.current.items,
          result
        ];
        console.log(JSON.stringify(inMemoCart.current.items, null, 2));
        return new Promise(rs => setTimeout(() => {
          res.send(inMemoCart.current);
          rs();
        }, 2000));
      } else {
        const result = Object.assign(inMemoCart.current.items[ idx ], {
          count: body.qty
        });
        //        res.send(result);
        console.log(JSON.stringify(inMemoCart.current.items, null, 2));
        return new Promise(rs => setTimeout(() => {
          res.send(inMemoCart.current);
          rs();
        }, 2000));
      }
    }

    res.sendStatus(404);
  },
});

export default cartResource;
