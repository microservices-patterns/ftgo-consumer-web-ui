import { connectRouter } from 'connected-react-router';
import address from './address/addressSlice';
import loading from './ui/loadingSlice';

export const unconnectedReducer = {
  address,
  ...loading
};

export const makeConnectedReducer = history => ({
  ...unconnectedReducer,
  ...(history ? { router: connectRouter(history) } : {})
});
