import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCart, postConfirmPayment, postCreatePaymentIntent, putUpdateCartWithItem } from '../actions/api';

const ns = 'cart';

export const obtainCartAsyncThunk = createAsyncThunk(
  'cart/createNew',
  async (data, { rejectWithValue, dispatch }) => {
    void data;
    return getCart();
  });

export const updateCartWithItemAsyncThunk = createAsyncThunk(
  'cart/updateCartWithItem',
  async (data, { rejectWithValue, dispatch }) => {
    const { restaurantId, itemId, qty, item } = data;
    void item;
    if (!restaurantId || !itemId) {
      return;
    }
    return putUpdateCartWithItem(restaurantId, itemId, qty);
  });

export const postCreatePaymentIntentAsyncThunk = createAsyncThunk(
  'payment/createPaymentIntent',
  async (data, { dispatch }) => {
    const { items } = data;
    return postCreatePaymentIntent(items);
  }
);

export const postConfirmPaymentAsyncThunk = createAsyncThunk(
  'payment/confirm',
  async (data, { rejectWithValue }) => {
    try {
      const { clientSecret, card } = data;
      return await postConfirmPayment(clientSecret, card);
    } catch (ex) {
      return rejectWithValue(ex);
    }
  }
);

const initialState = {
  id: '123',
  orderId: '',
  cartInfo: {
    total: 0,
    subTotal: 0,
    delivery: 0,
    tax: 0,
    taxAmount: 0
  },
  verboseCartInfo: {
    total: '$0.00',
    subTotal: '$0.00',
    delivery: '$0.00',
    tax: '$0.00',
    taxAmount: '0'
  },
  status: null,
  items: [],
  paymentSuccessful: null
};

export const accessCart = (propName) => ({ [ ns ]: state }) => propName ? (state?.[ propName ]) : state;
export const accessCartItems = () => ({ [ ns ]: state }) => state?.items ?? [];
export const accessCartStatus = () => ({ [ ns ]: state }) => state?.status;
export const accessCartInfo = () => ({ [ ns ]: state }) => state?.cartInfo ?? {};
export const accessVerboseCartInfo = () => ({ [ ns ]: state }) => state?.verboseCartInfo ?? {};
export const accessPaymentSuccessful = () => ({ [ ns ]: state }) => state?.paymentSuccessful;

export const cartSlice = createSlice({
  name: ns,
  initialState,
  reducers: {
    resetCart: () => Object.assign({}, initialState, { items: [] }),
    paymentSuccessful: (state) => {
      debugger;
      state.paymentSuccessful = true;
    },
    resetPaymentSuccessful: (state) => Object.assign({}, initialState, { items: [] })
  },
  extraReducers: builder => builder
    .addCase(obtainCartAsyncThunk.pending, (state, { payload }) => {
      state.status = 'pending';
    })
    .addCase(obtainCartAsyncThunk.fulfilled,
      (state, { payload, ...rest }) => {
        return Object.assign({}, state, payload, { status: 'ready' });
      })
    .addCase(obtainCartAsyncThunk.rejected, (state, { payload, ...rest }) => {
      state.status = 'error';
      state.items = [];
    })
    .addCase(updateCartWithItemAsyncThunk.pending, (state, { payload, meta }) => {
      const { itemId, item, restaurantId, qty } = meta.arg;
      const idx = state.items.findIndex(i => i.id === itemId);
      if (idx >= 0) {
        state.items = [
          ...state.items.slice(0, idx),
          Object.assign({}, state.items[ idx ], {
            count: qty,
            oldCount: state.items[ idx ].count
          }),
          ...state.items.slice(idx + 1)
        ]; // state.items.splice(idx, 1);
      } else {
        state.items = [
          ...state.items,
          Object.assign({}, item, {
            id: itemId,
            meta: { restaurantId },
            count: qty,
            oldCount: 0
          })
        ];
      }

    })
    .addCase(updateCartWithItemAsyncThunk.fulfilled, (state, { payload, meta }) => {

      if (!payload) {
        return state;
      }

      const { items, total, subTotal, delivery, tax, taxAmount, orderId } = payload;
      const cartInfo = { total, subTotal, delivery, tax, taxAmount };
      const stateItemsMap = new Map(state.items.map(i => ([ i.id, i ])));
      const arrivedItemsMap = new Map(items.map(i => ([ i.id, i ])));
      const uniqueIds = [ ...new Set([ ...stateItemsMap.keys(), ...arrivedItemsMap.keys() ]) ];
      state.items = uniqueIds.map((id) => Object.assign({},
        stateItemsMap.get(id) || {},
        arrivedItemsMap.get(id) || {},
        { 'oldCount': undefined }));
      state.cartInfo = cartInfo;
      state.verboseCartInfo = verboseCurrencyProps(cartInfo);
      state.orderId = orderId;

      //      [
      //        ...state.items.slice(0, idx),
      //        ...(oldItem.count ? [ Object.assign({}, state.items[ idx ], {
      //          oldCount: undefined
      //        }) ] : []),
      //        ...state.items.slice(idx + 1)
      //      ];

    })
    .addCase(updateCartWithItemAsyncThunk.rejected, (state, { payload, meta, error }) => {
      const { itemId } = meta.arg;
      const idx = state.items.findIndex(item => item.id === itemId);
      if (idx < 0) {
        return;
      }

      state.items = [
        ...state.items.slice(0, idx),
        ...((state.items[ idx ].oldCount === 0) ? [] : [
          Object.assign({}, state.items[ idx ], {
            oldCount: undefined,
            count: state.items[ idx ].oldCount
          })
        ]),
        ...state.items.slice(idx + 1)
      ];

    })

    .addCase(postCreatePaymentIntentAsyncThunk.pending, (state, { payload, meta }) => state)
    .addCase(postCreatePaymentIntentAsyncThunk.fulfilled, (state, { payload, meta }) => {
      // TODO: get amount sum from the response and set it here
      return state;
    })
    .addCase(postCreatePaymentIntentAsyncThunk.rejected, (state, { payload, meta }) => state)
    .addCase(postConfirmPaymentAsyncThunk.pending, (state, { payload, meta }) => state)
    .addCase(postConfirmPaymentAsyncThunk.fulfilled, (state, { payload, meta }) => state)
    .addCase(postConfirmPaymentAsyncThunk.rejected, (state, { payload, meta }) => state)
});

export const { resetCart, paymentSuccessful, resetPaymentSuccessful } = cartSlice.actions;

const namedReducer = {
  [ ns ]: cartSlice.reducer
};

export default namedReducer;

function verboseCurrencyProps(src) {
  return Object.fromEntries(Array.from(Object.entries(src), ([ k, v ]) => ([ k, verboseCurrency(v) ])));
}

function verboseCurrency(input) {
  if (!input) {
    return '$0.00';
  }
  return (`$${ Number(input).toFixed(2) }`).replace('$.', '$0.');
}
