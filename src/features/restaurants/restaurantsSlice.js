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
      state.selectedRestaurant = payload?.id;
    }
  }
});

export const { resetSelectedRestaurant, keepSelectedRestaurant } = restaurantsSlice.actions;

export const accessSelectedRestaurant = () => ({ [ ns ]: state }) => state.selectedRestaurant;

const namedReducer = {
  [ ns ]: restaurantsSlice.reducer
};


export default namedReducer;
