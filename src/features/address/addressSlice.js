import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchRestaurants } from './addressAPI';
import { safelyExecuteAsync } from '../../shared/promises';
import { push } from 'connected-react-router';

const initialState = {
  address: null,
  time: null,
  status: 'idle',
  value: null,
  error: null,
  restaurants: null
};

const ns = 'address';

export const retrieveRestaurantsForAddress = createAsyncThunk(
  'address/fetchRestaurants',
  async (data, { rejectWithValue, dispatch }) => {
    const { address, time, now = performance.now() } = data;
    const [ err, response ] = await safelyExecuteAsync(fetchRestaurants(address, time, now));
    if (err) {
      return rejectWithValue(err);
    }

    dispatch(keepAddressAndTime({ address, time, now }));
    dispatch(keepRestaurants(response.data));
    debugger;
    dispatch(push('/place'));
    return response.data;
  }
);

export const addressSlice = createSlice({
  name: ns,
  initialState,
  reducers: {
    keepAddressAndTime(state, action) {
      state.address = action.payload.address;
      state.time = action.payload.time;
      state.saved = action.payload.now;
    },
    keepRestaurants(state, action) {
      state.restaurants = action.payload;
    }
  },
  extraReducers: (builder) => builder
    .addCase(retrieveRestaurantsForAddress.pending, state => {
      state.status = 'loading';
    })
    .addCase(retrieveRestaurantsForAddress.fulfilled, (state, action) => {
      state.status = 'idle';
      state.value = action.payload;
    })
    .addCase(retrieveRestaurantsForAddress.rejected, (state, action) => {
      state.status = 'error';
      state.error = action.error;
    })
});

export const { keepAddressAndTime, keepRestaurants } = addressSlice.actions;

export const accessAddressStatus = () => ({ [ ns ]: state }) => state.status;
export const accessAddressRestaurantsList = () => ({ [ ns ]: state }) => state.value;

export default addressSlice.reducer;
