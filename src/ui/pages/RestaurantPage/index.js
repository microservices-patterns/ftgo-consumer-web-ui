import { SelectedAddressRow } from '../../components/SelectedAddressRow';
import { Button, Col, Container } from 'reactstrap';
import { SelectedRestaurantRow } from '../../components/SelectedRestaurantRow';
import { useDispatch, useSelector } from 'react-redux';
import { accessSelectedRestaurantId, resetSelectedRestaurant } from '../../../features/restaurants/restaurantsSlice';
import { useEffect, useMemo } from 'react';
import { navigateToEditDeliveryAddress } from '../../../features/actions/navigation';
import { YourTrayItems } from './yourTrayItems';
import { MenuItems } from './menuItems';
import { IconChevronRight } from '../../elements/icons';
import { accessCartItems } from '../../../features/cart/cartSlice';


export const RestaurantPage = ({ match }) => {

  const { placeId: urlRestaurantId } = match.params;

  const dispatch = useDispatch();
  const selectedRestaurantId = useSelector(accessSelectedRestaurantId());
  const cartItems = useSelector(accessCartItems());

  const cartSubtotal = useMemo(() => cartItems.reduce((sum, {
    price,
    count
  }) => (sum + Number(price) * count), 0), [ cartItems ]);

  useEffect(() => {
    if (selectedRestaurantId && urlRestaurantId) {
      return;
    }
    dispatch(resetSelectedRestaurant());
    dispatch(navigateToEditDeliveryAddress());

  }, [ dispatch, selectedRestaurantId, urlRestaurantId ]);

  return <div style={ { marginTop: '-1rem' } }>
    <SelectedAddressRow />
    <SelectedRestaurantRow />
    <Container className="d-flex flex-column flex-lg-row">
      <Col xs={ 12 } lg={ 7 } className="py-2">
        <h2>Menu Items:</h2>
        <MenuItems restaurantId={ selectedRestaurantId } />
      </Col>
      <Col xs={ 12 } lg={ 5 } className="py-2">
        <h2>Your Tray: <div className="d-inline-block float-right">{ `$${ cartSubtotal.toFixed(2) }` }</div></h2>
        <YourTrayItems />
        <div className="text-right">
          <Button color="primary" disabled={ !cartItems.length }>Checkout <IconChevronRight /></Button>
        </div>
      </Col>
    </Container>
  </div>;
};

export default RestaurantPage;
