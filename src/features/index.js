import { connectRouter } from 'connected-react-router';
import counterReducer from './counter/counterSlice';

export const unconnectedReducer = {
  counter: counterReducer,
};

export const makeConnectedReducer = history => ({
  ...unconnectedReducer,
  ...(history ? { router: connectRouter(history) } : {})
});
