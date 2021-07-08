import { createSlice } from '@reduxjs/toolkit';

const ns= 'card';
const initialState = {
  value: {},
  errors: {}
};

export const accessCardValue = () => ({ [ns]: state }) => state.value;
export const accessCardErrors = () => ({ [ns]: state }) => state.errors;

export const cardSlice = createSlice({
  name: ns,
  initialState,
  reducers: {
    updateCardValue: (state, { payload }) => {
      if (!payload) {
        return;
      }
      state.value = payload?.card;
    },
    resetCard: (state) => {
      state.value = {};
      state.errors = {};
    }
  }
});


export const { updateCardValue, resetCard } = cardSlice.actions;

const namedReducer = {
  [ ns ]: cardSlice.reducer
};

export default namedReducer;
