import { createSlice } from '@reduxjs/toolkit';

const ns = 'restaurants';

const initialState = {
  selectedRestaurant: null
};

export const restaurantsSlice = createSlice({
  name: ns,
  initialState,
  reducers: {
    resetSelectedRestaurant(state) {
      state.selectedRestaurant = null;
    },
    keepSelectedRestaurant(state, { payload }) {
      debugger;
      state.selectedRestaurantId = payload?.id;
    }
  }
});

export const { resetSelectedRestaurant, keepSelectedRestaurant } = restaurantsSlice.actions;

export const accessSelectedRestaurantId = () => ({ [ ns ]: state }) => state.selectedRestaurantId;

const namedReducer = {
  [ ns ]: restaurantsSlice.reducer
};


export default namedReducer;
