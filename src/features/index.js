import { connectRouter } from 'connected-react-router';
import address from './address/addressSlice';
import restaurants from './restaurants/restaurantsSlice';
import loading from './ui/loadingSlice';

export const unconnectedReducer = {
  address,
  ...restaurants,
  ...loading
};

export const makeConnectedReducer = history => ({
  ...unconnectedReducer,
  ...(history ? { router: connectRouter(history) } : {})
});
