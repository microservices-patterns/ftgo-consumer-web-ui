import { SelectedAddressRow } from '../../components/SelectedAddressRow';
import { Button, Col, Container } from 'reactstrap';
import { SelectedRestaurantRow } from '../../components/SelectedRestaurantRow';
import { useDispatch, useSelector } from 'react-redux';
import { accessSelectedRestaurantId, resetSelectedRestaurant } from '../../../features/restaurants/restaurantsSlice';
import React, { useCallback, useEffect } from 'react';
import { navigateToCheckout, navigateToEditDeliveryAddress } from '../../../features/actions/navigation';
import { YourTrayItems } from './yourTrayItems';
import { MenuItems } from './menuItems';
import { IconChevronRight } from '../../elements/icons';
import { accessCartInfo, accessCartItems, accessVerboseCartInfo } from '../../../features/cart/cartSlice';
import { e2eAssist } from '../../../testability';
import { accessIsLoading } from '../../../features/ui/loadingSlice';


export const RestaurantPage = ({ match }) => {

  const { placeId: urlRestaurantId } = match.params;

  const dispatch = useDispatch();
  const selectedRestaurantId = useSelector(accessSelectedRestaurantId());
  const cartItems = useSelector(accessCartItems());
  const isLoading = useSelector(accessIsLoading());
  const cartInfo = useSelector(accessCartInfo());
  const verboseCartInfo = useSelector(accessVerboseCartInfo());

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
        <h2>Your Tray: <div className="d-inline-block float-right" { ...e2eAssist.INFO_CART_VALUE_OF(cartInfo.subTotal ?? 0 ) }>{ verboseCartInfo.subTotal ?? '' }</div>
        </h2>
        <YourTrayItems />
        <div className="text-right">
          <Button color="primary" disabled={ isLoading || !cartItems.length } onClick={ cartItems.length ? handleToCheckout : null }  { ...e2eAssist.BTN_TO_CHECKOUT }>Checkout <IconChevronRight /></Button>
        </div>
      </Col>
    </Container>
  </div>;
};

export default RestaurantPage;
