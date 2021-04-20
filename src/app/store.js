import { configureStore } from '@reduxjs/toolkit';
import { createBrowserHistory as createHistory, createMemoryHistory as createMemHistory } from 'history';
import { makeConnectedReducer } from '../features';

//const baseURL = ensureEnvVariable('REACT_APP_API_URL');

export const history = process.env.NODE_ENV === 'test' ?
  createMemHistory() :
  createHistory({
    //getUserConfirmation: getConfirmation
  });

const connectedReducer = makeConnectedReducer(history);

export const store = configureStore({
  reducer: connectedReducer
});
