import { push } from 'connected-react-router';
import { routePaths } from '../../ui/pages/AppRoutes/routePaths';

export const navigateToEditDeliveryAddress = () => push(routePaths.landing);
export const navigateToPickRestaurants = () => push(routePaths.restaurants);
export const navigateToEditMenu = (restaurantId) => push(routePaths.restaurant.replace(':placeId', restaurantId));
export const navigateToCheckout = () => push(routePaths.checkout);
export const navigateToThankYou = () => push(routePaths.thankyou);
