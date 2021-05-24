import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { retrieveRestaurantByIdAsyncThunk } from '../address/addressSlice';

const ns = 'restaurants';

const menuAdapter = createEntityAdapter({
  selectId: ({ id }) => id,
  sortComparer: ({ id: a }, { id: b }) => a.localeCompare(b)
});
const { selectAll } = menuAdapter.getSelectors();

const initialState = {
  selectedRestaurant: null,
  menuState: {},
  menus: {}
};


export const restaurantsSlice = createSlice({
  name: ns,
  initialState,
  reducers: {
    resetSelectedRestaurant(state) {
      state.selectedRestaurant = null;
    },
    keepSelectedRestaurant(state, { payload }) {
      state.selectedRestaurantId = payload?.id;
    }
  },
  extraReducers: builder => builder.addCase(
    retrieveRestaurantByIdAsyncThunk.pending, (state, { payload, meta }) => {
      if (!meta) {
        return;
      }
      const { restaurantId } = meta.arg;
      state.menuState[ restaurantId ] = 'loading';
      state.menus[ restaurantId ] = menuAdapter.getInitialState();
    }
  ).addCase(
    retrieveRestaurantByIdAsyncThunk.fulfilled, (state, { payload, meta }) => {
      if (!payload) {
        return;
      }
      const { restaurantId } = meta.arg ?? {};
      if (!restaurantId) {
        return;
      }
      state.menuState[ restaurantId ] = 'ready';
      menuAdapter.setAll(state.menus[ restaurantId ], payload.menu);
    }
  ).addCase(
    retrieveRestaurantByIdAsyncThunk.rejected, (state, { payload, meta }) => {
      if (!meta) {
        return;
      }
      const { restaurantId } = meta.arg ?? {};
      if (!restaurantId) {
        return;
      }
      state.menuState[ restaurantId ] = undefined;
    }
  )
});

export const { resetSelectedRestaurant, keepSelectedRestaurant } = restaurantsSlice.actions;

export const accessSelectedRestaurantId = () => ({ [ ns ]: state }) => state.selectedRestaurantId;
export const accessRestaurantMenuState = (restaurantId) => ({ [ ns ]: state }) => state.menuState[ restaurantId ];
export const accessMenuForRestaurant = (restaurantId, fallback) => ({ [ ns ]: state }) => (state.menus[ restaurantId ] ?
  selectAll(state.menus[ restaurantId ]) :
  undefined) || fallback;

const namedReducer = {
  [ ns ]: restaurantsSlice.reducer
};


export default namedReducer;
