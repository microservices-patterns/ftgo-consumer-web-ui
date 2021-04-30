import { push } from 'connected-react-router';
import { routePaths } from '../../ui/pages/AppRoutes/routePaths';

export const navigateToPickRestaurants = () => push(routePaths.restaurants);
export const navigateToEditDeliveryAddress = () => push(routePaths.landing);
export const navigateToEditMenu = (restaurantId) => push(routePaths.restaurant.replace(':placeId', restaurantId));
