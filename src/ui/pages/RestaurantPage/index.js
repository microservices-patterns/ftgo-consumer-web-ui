import { SelectedAddressRow } from '../../components/SelectedAddressRow';
import { Button, Col, Container } from 'reactstrap';
import { SelectedRestaurantRow } from '../../components/SelectedRestaurantRow';
import { useDispatch, useSelector } from 'react-redux';
import { accessSelectedRestaurantId, resetSelectedRestaurant } from '../../../features/restaurants/restaurantsSlice';
import React, { useCallback, useEffect, useMemo } from 'react';
import { navigateToCheckout, navigateToEditDeliveryAddress } from '../../../features/actions/navigation';
import { YourTrayItems } from './yourTrayItems';
import { MenuItems } from './menuItems';
import { IconChevronRight } from '../../elements/icons';
import { accessCartItems } from '../../../features/cart/cartSlice';
import { e2eAssist } from '../../../shared/e2e';


export const RestaurantPage = ({ match }) => {

  const { placeId: urlRestaurantId } = match.params;

  const dispatch = useDispatch();
  const selectedRestaurantId = useSelector(accessSelectedRestaurantId());
  const cartItems = useSelector(accessCartItems());

  const cartSubtotal = useMemo(() => cartItems.reduce((sum, {
    price,
    count
  }) => (sum + Number(price) * count), 0), [ cartItems ]);


  const handleToCheckout = useCallback(() => {
    dispatch(navigateToCheckout());
  }, [ dispatch ]);

  useEffect(() => {
    if (selectedRestaurantId && urlRestaurantId && (selectedRestaurantId === urlRestaurantId)) {
      return;
    }
    dispatch(resetSelectedRestaurant());
    dispatch(navigateToEditDeliveryAddress());
  }, [ dispatch, selectedRestaurantId, urlRestaurantId ]);

  return <div style={ { marginTop: '-1rem' } } { ...e2eAssist.PAGE_RESTAURANT_MENU }>
    <SelectedAddressRow />
    <SelectedRestaurantRow />
    <Container className="d-flex flex-column flex-lg-row">
      <Col xs={ 12 } lg={ 7 } className="py-2">
        <h2>Menu Items:</h2>
        <MenuItems restaurantId={ selectedRestaurantId } />
      </Col>
      <Col xs={ 12 } lg={ 5 } className="py-2">
        <h2>Your Tray: <div className="d-inline-block float-right" { ...e2eAssist.INFO_CART_VALUE_OF(cartSubtotal.toFixed(2)) }>{ `$${ cartSubtotal.toFixed(2) }` }</div></h2>
        <YourTrayItems />
        <div className="text-right">
          <Button color="primary" disabled={ !cartItems.length } onClick={ cartItems.length ? handleToCheckout : null }  { ...e2eAssist.BTN_TO_CHECKOUT }>Checkout <IconChevronRight /></Button>
        </div>
      </Col>
    </Container>
  </div>;
};

export default RestaurantPage;
