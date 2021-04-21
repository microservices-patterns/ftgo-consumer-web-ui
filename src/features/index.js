import { connectRouter } from 'connected-react-router';
import counter from './counter/counterSlice';
import address from './address/addressSlice';
import loading from './ui/loadingSlice';

export const unconnectedReducer = {
  counter,
  address,
  loading
};

export const makeConnectedReducer = history => ({
  ...unconnectedReducer,
  ...(history ? { router: connectRouter(history) } : {})
});
