const { createReducer } = require('@reduxjs/toolkit');


function isPendingAction(action) {
  return action.type.endsWith('/pending');
}

function isFulfilledAction(action) {
  return action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected');
}

const initialState = {
  isLoading: false,
  pendingRequests: 0,
  requests: {} // Object.create(null)
};

const ns = 'loading';

const loadingReducer = createReducer(initialState, builder => {
  builder
    .addMatcher(isPendingAction, (state, action) => {
      state.pendingRequests++;
      state.isLoading = true;
      state.requests[ action.meta.requestId ] = 'pending';
    })
    .addMatcher(isFulfilledAction, (state, action) => {
      state.pendingRequests--;
      state.isLoading = !!state.pendingRequests;
      state.requests[ action.meta.requestId ] = action.type.endsWith('/rejected') ? 'rejected' : 'resolved';
      if (action.type.endsWith('/rejected')) {
        console.log('/rejected', action.payload, action.meta)
      }
    });
});

const namedReducer = {
  [ ns ]: loadingReducer
};

export const accessIsLoading = () => ({ [ns]: state }) => state.isLoading;


export default namedReducer;
