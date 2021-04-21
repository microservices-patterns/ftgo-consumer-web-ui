import { push } from 'connected-react-router';
import { routePaths } from '../../ui/pages/AppRoutes/routePaths';

export const navigateToPickRestaurants = () => push(routePaths.restaurants);
export const navigateToEditDeliveryAddress = () => push(routePaths.landing);
