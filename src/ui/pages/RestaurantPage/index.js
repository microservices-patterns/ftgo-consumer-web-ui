import { SelectedAddressRow } from '../../components/SelectedAddressRow';
import { Button, Col, Container } from 'reactstrap';
import { SelectedRestaurantRow } from '../../components/SelectedRestaurantRow';
import { useDispatch, useSelector } from 'react-redux';
import {
  accessMenuForRestaurant,
  accessRestaurantMenuState,
  accessSelectedRestaurantId,
  resetSelectedRestaurant
} from '../../../features/restaurants/restaurantsSlice';
import { useCallback, useEffect, useMemo } from 'react';
import { navigateToEditDeliveryAddress } from '../../../features/actions/navigation';
import { retrieveRestaurantByIdAsyncThunk } from '../../../features/address/addressSlice';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import './menuItems.scss';

function countItemsInCart(id, cart) {
  return /[02468]$/.test(id) ? 0 : 1;
}

function AvailableMenuItems({ restaurantId }) {

  const dispatch = useDispatch();
  const menuState = useSelector(accessRestaurantMenuState(restaurantId));
  const menuList = useSelector(accessMenuForRestaurant(restaurantId));

  useEffect(() => {
    if (menuState === 'ready') {
      return;
    }
    debugger;
    dispatch(retrieveRestaurantByIdAsyncThunk({ restaurantId }));
  }, [ dispatch, menuState, restaurantId ]);

  const selectRowProps = useMemo(() => ({
    mode: 'radio',
    clickToSelect: true,
    selectionHeaderRenderer: () => null,
    selectionRenderer: ({ mode, ...rest }) => null,
    style: { backgroundColor: '#c8e6c980' }
  }), []);

  const handleAddToCart = useCallback(() => {}, []);

  const columns = [
    {
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
    }, {
      dataField: 'actions',
      isDummyField: true,
      text: 'Action',
      formatter: (cellContent, row, ...args) => {
        if (row.meta?.itemsInCart) {
          return <Button color={ 'success' } size={ 'sm' } onClick={ handleAddToCart }>+1</Button>;
        }
        return <Button color={ 'info' } size={ 'sm' } onClick={ handleAddToCart }>Add</Button>;
      }
    }
  ];

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

  const cart = [];

  const zippedList = menuList ? menuList.map(item => Object.assign({}, item, { meta: {
    itemsInCart: countItemsInCart(item.id, cart)
    } })) : [];

  return <BootstrapTable
    bootstrap4
    hover
    keyField="id"
    data={ zippedList || [] }
    noDataIndication={ <>Menu is temporarily empty</> }
    columns={ columns }
    defaultSorted={ defaultSorted }
    selectRow={ selectRowProps }
    bordered={ false }
    pagination={ paginationFactory({
      sizePerPage: 5,
      sizePerPageList: [ 5, 10, 25, 30, 50 ]
    }) }
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
