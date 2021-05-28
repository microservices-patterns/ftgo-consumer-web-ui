import { push } from 'connected-react-router';
import { routePaths } from '../../ui/pages/AppRoutes/routePaths';
import { debugged } from '../../shared/diagnostics';

export const navigateToEditDeliveryAddress = () => push(routePaths.landing);
export const navigateToPickRestaurants = () => push(routePaths.restaurants);
export const navigateToEditMenu = (restaurantId) => push(routePaths.restaurant.replace(':placeId', restaurantId));
export const navigateToCheckout = () => push(routePaths.checkout);
