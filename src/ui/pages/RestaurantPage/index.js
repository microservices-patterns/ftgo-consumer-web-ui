import { SelectedAddressRow } from '../../components/SelectedAddressRow';
import { Col, Container } from 'reactstrap';
import { SelectedRestaurantRow } from '../../components/SelectedRestaurantRow';
import { useDispatch, useSelector } from 'react-redux';
import {
  accessMenuForRestaurant,
  accessRestaurantMenuState,
  accessSelectedRestaurantId,
  resetSelectedRestaurant
} from '../../../features/restaurants/restaurantsSlice';
import { useEffect, useMemo } from 'react';
import { navigateToEditDeliveryAddress } from '../../../features/actions/navigation';
import { retrieveRestaurantByIdAsyncThunk } from '../../../features/address/addressSlice';
import BootstrapTable from 'react-bootstrap-table-next';

function AvailableMenuItems({ restaurantId }) {

  const dispatch = useDispatch();
  const menuState = useSelector(accessRestaurantMenuState(restaurantId));
  const menuList = useSelector(accessMenuForRestaurant(restaurantId));
  void menuList;

  useEffect(() => {
    if (menuState === 'ready') {
      return;
    }
    debugger;
    dispatch(retrieveRestaurantByIdAsyncThunk({ restaurantId }));
  }, [ dispatch, menuState, restaurantId ]);

  const selectRow = useMemo(() => ({
    mode: 'radio'
  }), []);

  const columns = [ {
    dataField: 'id',
    text: 'Ref ID',
    sort: true
  }, {
    dataField: 'name',
    text: 'Food Item',
    sort: true
  }, {
    dataField: 'cuisine_name',
    text: 'Cuisine',
    sort: true
  }, {
    dataField: 'category_name',
    text: 'Category',
    sort: true
  }, {
    dataField: 'price',
    text: 'Price',
    sort: true
  } ];

  const defaultSorted = [ {
    dataField: 'name',
    order: 'desc'
  } ];

  const x = {
    'id': '224474',
    'name': 'Chicken Livers and Portuguese Roll',
    'position': 1,
    'price': '250.00',
    'consumable': '1:1',
    'cuisine_name': 'Indian',
    'category_name': 'Appeteasers',
    'discount': {
      'type': '',
      'amount': '0.00'
    },
    'tags': []
  };

  void x;

  if (menuState !== 'ready') {
    return <>Updating the menu...</>;
  }

  return <BootstrapTable
    bootstrap4
    hover
    keyField="id"
    data={ menuList || [] }
    noDataIndication={ <>Menu is temporarily empty</> }
    columns={ columns }
    defaultSorted={ defaultSorted }
    selectRow={ selectRow }
    bordered={ false }
  />;
}

function YourTrayItems({ sessionId }) {
  void sessionId;
  return null;
}


export const RestaurantPage = ({ match }) => {

  const { placeId: urlRestaurantId } = match.params;

  const dispatch = useDispatch();
  const selectedRestaurantId = useSelector(accessSelectedRestaurantId());

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
    <Container className="d-flex">
      <Col sm={ 8 } className="py-2">
        <h2>Menu Items:</h2>
        <AvailableMenuItems restaurantId={ selectedRestaurantId } />
      </Col>
      <Col sm={ 4 } className="py-2">
        <h2>Your Tray:</h2>
        <YourTrayItems sessionId={ selectedRestaurantId } />
      </Col>
    </Container>
  </div>;
};

export default RestaurantPage;
