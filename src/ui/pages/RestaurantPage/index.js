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
import { useEffect, useMemo } from 'react';
import curry from 'lodash-es/curry';
import { navigateToEditDeliveryAddress } from '../../../features/actions/navigation';
import { retrieveRestaurantByIdAsyncThunk } from '../../../features/address/addressSlice';
import { PaginatedTable } from '../../elements/paginatedTable';
import {
  accessCart,
  accessCartItems,
  accessCartStatus,
  obtainNewCartAsyncThunk,
  updateCartWithItemAsyncThunk
} from '../../../features/cart/cartSlice';


function AvailableMenuItems({ restaurantId }) {

  const dispatch = useDispatch();
  const menuState = useSelector(accessRestaurantMenuState(restaurantId));
  const menuList = useSelector(accessMenuForRestaurant(restaurantId));
  const cartId = useSelector(accessCart('id'));
  const cartStatus = useSelector(accessCartStatus());
  const cartItems = useSelector(accessCartItems());

  useEffect(() => {
    if (menuState) {
      return;
    }
    debugger;
    dispatch(retrieveRestaurantByIdAsyncThunk({ restaurantId }));
  }, [ dispatch, menuState, restaurantId ]);

  useEffect(() => {
    if (cartStatus) {
      return;
    }
    debugger;
    dispatch(obtainNewCartAsyncThunk());
  }, [ cartStatus, dispatch ]);


  const cartItemsMap = useMemo(() => new Map(cartItems.map(i => [ i.id, i ])), [ cartItems ]);
  const handleAddToCart = useMemo(() => cartId ? curry((item, qty, _) => {
    console.log(item, qty);
    debugger;
    dispatch(updateCartWithItemAsyncThunk({
      cartId, restaurantId, itemId: item.id, qty, item
    }));
  }) : (a, b) => (c) => {
    console.log(a, b, c);
    debugger;
  }, [ cartId, dispatch, restaurantId ]);

  const columns = useMemo(() => ([
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
      formatter: (cellContent, row) => {
        if (cartItemsMap.has(row.id)) {
          const item = cartItemsMap.get(row.id);
          return <Button color={ 'success' } size={ 'sm' } disabled={ !cartId || (item.oldCount !== undefined) } onClick={ handleAddToCart(row, 1) }>+1</Button>;
        }
        return <Button color={ 'info' } size={ 'sm' } disabled={ !cartId } onClick={ handleAddToCart(row, 1) }>Add</Button>;
      }
    }
  ]), [ cartId, cartItemsMap, handleAddToCart ]);

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

  return <PaginatedTable
    bootstrap4
    hover
    keyField="id"
    data={ menuList || [] }
    noDataIndication={ <>Menu is temporarily empty</> }
    columns={ columns }
    defaultSorted={ defaultSorted }
    bordered={ false }
    paginationOnTop
    paginationFactoryOptions={ {
      custom: true,
      sizePerPage: 5,
      sizePerPageList: [ 5, 10, 25, 30, 50 ],
      hidePageListOnlyOnePage: true
    } }
  />;

}

function YourTrayItems() {

  const cartId = useSelector(accessCart('id'));
  const cartStatus = useSelector(accessCartStatus());
  const cartItems = useSelector(accessCartItems());


  const columns = [
    {
      dataField: 'id',
      text: 'Ref ID'
    }, {
      dataField: 'name',
      text: 'Food Item',
      sort: true
    }, {
      dataField: 'count',
      text: 'Qty'
    }
  ];

  const defaultSorted = [ {
    dataField: 'name',
    order: 'desc'
  } ];

  if (!cartId || (cartStatus !== 'ready')) {
    return <>Updating the tray...</>;
  }
  return <PaginatedTable
    bootstrap4
    hover
    keyField="id"
    data={ cartItems || [] }
    noDataIndication={ <>Add food to your tray</> }
    columns={ columns }
    defaultSorted={ defaultSorted }
    bordered={ false }
    paginationOnTop
    paginationFactoryOptions={ {
      custom: true,
      sizePerPage: 5,
      sizePerPageList: [ 5, 10, 25, 30, 50 ],
      hidePageListOnlyOnePage: true
    } }
  />;
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
        <YourTrayItems />
      </Col>
    </Container>
  </div>;
};

export default RestaurantPage;
