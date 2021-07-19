import resource from 'resource-router-middleware';
import { cache } from './cache';
import menu from '../models/menu';

const initialCart = {};

const TAX_AMOUNT = 0.06;
const DELIVERY_FEE = 0.0;

const facetName = 'cart';

function createNewCart() {
  return Object.assign({}, initialCart, {
    items: [],
    orderId: `FTGO_${ Math.random().toString().replace(/(\d{4,4})/, '_$1_').split('_')[1] }`
  });
}

const cartResource = ({ config, db }) => resource({
  /** Property name to store preloaded entity on `request`. */
  id: facetName,

  index({ params }, res) {

    // this is probably the point where a new order needs to be created
    cache.set('cart', createNewCart());

    const inMemoCart = cache.get('cart');

    res.json(updateCartWithStats(inMemoCart));
  },


  /** PUT /:id - Update a given entity */
  update({ body, ...req }, res) {

    const { restaurantId, itemId, quantity } = body;
    
    if (!cache.has('cart')) {
      cache.set('cart', createNewCart());
    }

    const inMemoCart = cache.get('cart');
    const foundItem = inMemoCart.items.find(item => item.id === itemId);
    const nextInMemoCart = foundItem ? {
      ...inMemoCart,
      items: [
        ...inMemoCart.items.filter(item => item.id === itemId), //.map((i, iIdx) => (iIdx === idx) ? { ...i, count: quantity } : i)
        {
          ...foundItem,
          count: quantity
        }
      ]
    } : {
      ...inMemoCart,
      items: [
        ...inMemoCart.items,
        {
          id: itemId,
          count: quantity,
          restaurantId: restaurantId,
        }
      ]
    }

    if (nextInMemoCart.items.every(({ count }) => count === 0)) {
      nextInMemoCart.items = [];
    }

    cache.set('cart', updateCartWithStats(nextInMemoCart));
    console.log(JSON.stringify(updateCartWithStats(nextInMemoCart), null, 2));
    return new Promise(rs => setTimeout(() => {
      const result = updateCartWithStats(nextInMemoCart)
      res.json(result);
      rs();
    }, 2000));

  },
});

export default cartResource;

export function updateCartWithStats(cart) {

  const itemsMap = new Map(cart.items.map(item => ([ item.id, item ])));
  const menuMap = new Map(menu.map(item => ([ item.id, item ])));
  const source = cart.items.map(i => Object.assign({}, menuMap.get(i.id), itemsMap.get(i.id)));
  console.log('source', source);

  const subTotal = source.reduce((sum, { price, count }) => (sum + Number(price) * Number(count)), 0);

  console.log('subTotal:', subTotal);

  const tax = TAX_AMOUNT * subTotal;
  const delivery = Number(DELIVERY_FEE);
  const total = subTotal + tax + delivery;

  return {
    ...cart,
    subTotal,
    tax,
    taxAmount: TAX_AMOUNT,
    delivery,
    total
  }
}
