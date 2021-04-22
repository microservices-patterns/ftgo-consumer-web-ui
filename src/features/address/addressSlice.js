import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { fetchRestaurants } from './addressAPI';
import { safelyExecuteAsync } from '../../shared/promises';
import { navigateToPickRestaurants } from '../actions/navigation';


const restaurantsAdapter = createEntityAdapter({
  selectId: ({ id }) => id,
  sortComparer: ({ id: a }, { id: b }) => a.localeCompare(b)
});

const initialState = {
  address: null,
  time: null,
  origin: null,
  status: 'idle',
  value: null,
  error: null,
  restaurants: restaurantsAdapter.getInitialState()
};

const ns = 'address';

export const retrieveRestaurantsForAddress = createAsyncThunk(
  'address/fetchRestaurants',
  /**
   *
   * @param { { address: string, time: string, now: number }} data
   * @param rejectWithValue
   * @param dispatch
   * @return {Promise<RejectWithValue<{} extends {rejectValue: infer RejectValue} ? RejectValue : unknown>|*>}
   */
  async (data, { rejectWithValue, dispatch }) => {
    const { address, time, now = (new Date() - 0) } = data;
    const [ err, response ] = await safelyExecuteAsync(fetchRestaurants(address, time, now));
    if (err) {
      return rejectWithValue(err);
    }

    dispatch(keepAddressAndTime({ address, time, now }));
    // TODO: convert it into correct reducer
    dispatch(keepRestaurants(response.data));
    debugger;
    dispatch(navigateToPickRestaurants());
    return response.data;
  }
);



export const addressSlice = createSlice({
  name: ns,
  initialState,
  reducers: {
    resetAddressAndTime(state) {
      state.address = null;
      state.time = null;
      state.origin = null;
    },
    keepAddressAndTime(state, action) {
      state.address = action.payload.address;
      state.time = action.payload.time;
      state.origin = action.payload.now;
    },
    keepRestaurants(state, action) {
      state.restaurants = action.payload;
    }
  },
  extraReducers: (builder) => builder
    .addCase(retrieveRestaurantsForAddress.pending, state => {
      state.status = 'loading';
    })
    .addCase(retrieveRestaurantsForAddress.fulfilled, (state, { payload }) => {
      state.status = 'idle';
      restaurantsAdapter.setAll(state.restaurants, payload.restaurants);
    })
    .addCase(retrieveRestaurantsForAddress.rejected, (state, action) => {
      state.status = 'error';
      state.error = action.error;
    })
});

export const { keepAddressAndTime, keepRestaurants, resetAddressAndTime } = addressSlice.actions;

export const accessAddressStatus = () => ({ [ ns ]: state }) => state.status;
export const accessDeliveryAddress = () => ({ [ ns ]: state }) => state.address;
export const accessDeliveryTime = () => ({ [ ns ]: state }) => state.time;
export const accessDeliveryTimeBlock = () => ({ [ ns ]: state }) => (state.time && state.origin) ? ({ time: state.time, origin: state.origin }) : null;
export const accessRestaurantsList = () => ({ [ ns ]: state }) => state.restaurants;

export default addressSlice.reducer;
