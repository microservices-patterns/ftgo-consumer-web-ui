import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { safelyExecuteAsync } from '../../shared/promises';
import { navigateToPickRestaurants } from '../actions/navigation';
import { getRestaurantById, postAddressObtainRestaurants } from '../actions/api';


const restaurantsAdapter = createEntityAdapter({
  selectId: ({ id }) => id,
  sortComparer: ({ id: a }, { id: b }) => a.localeCompare(b)
});

const { selectById: selectRestaurantById, selectAll: selectAllRestaurants } = restaurantsAdapter.getSelectors();

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
  'address/postAddressObtainRestaurants',
  /**
   *
   * @param { { address: string, time: string, now: number }} data
   * @param rejectWithValue
   * @param dispatch
   * @return {Promise<RejectWithValue<{} extends {rejectValue: infer RejectValue} ? RejectValue : unknown>|*>}
   */
  async (data, { rejectWithValue, dispatch }) => {
    const { address, time, now = (new Date() - 0) } = data;
    const [ err, payload ] = await safelyExecuteAsync(postAddressObtainRestaurants(address, time, now));
    if (err) {
      return rejectWithValue(err);
    }

    dispatch(keepAddressAndTime({ address, time, now }));
    dispatch(navigateToPickRestaurants());

    return payload;
  }
);


export const retrieveRestaurantByIdAsyncThunk = createAsyncThunk(
  'restaurant/fetchById',
  async (data, { dispatch }) => {
    debugger;
    if (!data) {
      return;
    }
    const { restaurantId } = data;
    if (!restaurantId) {
      return;
    }
    return getRestaurantById(restaurantId);
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
    }).addCase(
      retrieveRestaurantByIdAsyncThunk.pending, state => {
        state.status = 'loading';
      }
    ).addCase(
      retrieveRestaurantByIdAsyncThunk.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        if (!payload) {
          return;
        }
        restaurantsAdapter.addOne(state.restaurants, payload);
      }
    ).addCase(
      retrieveRestaurantByIdAsyncThunk.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error;
      }
    )
});

export const { keepAddressAndTime, /*keepRestaurants, */resetAddressAndTime } = addressSlice.actions;

export const accessAddressStatus = () => ({ [ ns ]: state }) => state.status;
export const accessDeliveryAddress = () => ({ [ ns ]: state }) => state.address;
export const accessDeliveryTime = () => ({ [ ns ]: state }) => state.time;
export const accessDeliveryTimeBlock = () => ({ [ ns ]: state }) => (state.time && state.origin) ? ({
  time: state.time,
  origin: state.origin
}) : null;
export const accessRestaurantsList = () => ({ [ ns ]: state }) => selectAllRestaurants(state.restaurants);
export const accessRestaurantInfo = (id) => ({ [ ns ]: state }) => selectRestaurantById(state.restaurants, id);


const namedReducer = {
  [ ns ]: addressSlice.reducer
};


export default namedReducer;
