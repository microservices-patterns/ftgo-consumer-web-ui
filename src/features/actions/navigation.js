import { push } from 'connected-react-router';
import { routePaths } from '../../ui/pages/AppRoutes/routePaths';
import { debugged } from '../../shared/diagnostics';

export const navigateToPickRestaurants = () => push(routePaths.restaurants);
export const navigateToEditDeliveryAddress = () => push(routePaths.landing);
export const navigateToEditMenu = (restaurantId) => /anon/.test(restaurantId) ? debugged(restaurantId): push(routePaths.restaurant.replace(':placeId', restaurantId));
export const navigateToCheckout = () => push(routePaths.checkout);
