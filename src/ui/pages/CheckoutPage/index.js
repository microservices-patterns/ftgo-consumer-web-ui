import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { accessCart, accessCartItems, accessCartStatus } from '../../../features/cart/cartSlice';
import { navigateToEditMenu, navigateToPickRestaurants } from '../../../features/actions/navigation';
import { Container } from 'reactstrap';
import { accessSelectedRestaurantId } from '../../../features/restaurants/restaurantsSlice';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const cartStatus = useSelector(accessCartStatus());
  const cartItems = useSelector(accessCartItems());
  const cartId = useSelector(accessCart('id'));
  const selectedRestaurantId = useSelector(accessSelectedRestaurantId());

  void cartItems;

  useEffect(() => {
    if (!cartId || (cartStatus !== 'ready')) {
      return null;
    }
    if (selectedRestaurantId) {
      dispatch(navigateToEditMenu(selectedRestaurantId));
    } else {
      dispatch(navigateToPickRestaurants());
    }
  }, [ cartId, cartStatus, dispatch, selectedRestaurantId ]);

  if (!cartId || (cartStatus !== 'ready')) {
    return null;
  }

  return <div style={ { marginTop: '-1rem' } }><Container>
    CheckoutPage
  </Container></div>;
};

export default CheckoutPage;
