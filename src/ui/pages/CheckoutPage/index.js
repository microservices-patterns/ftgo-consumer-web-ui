import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { accessCart, accessCartItems, accessCartStatus } from '../../../features/cart/cartSlice';
import { navigateToEditMenu } from '../../../features/actions/navigation';
import { Container } from 'reactstrap';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const cartStatus = useSelector(accessCartStatus());
  const cartItems = useSelector(accessCartItems());
  const cartId = useSelector(accessCart('id'));
  void cartItems;

  useEffect(() => {
    if (!cartId || (cartStatus !== 'ready')) {
      return null;
    }
    dispatch(navigateToEditMenu());
  }, [ cartId, cartStatus, dispatch ]);

  if (!cartId || (cartStatus !== 'ready')) {
    return null;
  }

  return <div style={ { marginTop: '-1rem' } }><Container>
    CheckoutPage
  </Container></div>;
};

export default CheckoutPage;
