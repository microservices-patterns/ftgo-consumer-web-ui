import { useDispatch, useSelector } from 'react-redux';
import { accessMenuForRestaurant, accessRestaurantMenuState } from '../../../features/restaurants/restaurantsSlice';
import { accessCart, accessCartItems, obtainCartAsyncThunk } from '../../../features/cart/cartSlice';
import React, { useCallback, useEffect, useMemo } from 'react';
import { retrieveRestaurantByIdAsyncThunk } from '../../../features/address/addressSlice';
import { createMap, useUpdateCartHandler } from './hooks';
import { Button } from 'reactstrap';
import { IconCartPlus, IconPlus } from '../../elements/icons';
import { PaginatedTable } from '../../elements/paginatedTable';
import { usePrevious } from 'react-use';
import { e2eAssist } from '../../../testability';


/**
 * @value {
    'id': '224474',
    'name': 'Chicken Livers and Portuguese Roll',
    'position': 1,
    'price': '250.00',
    'consumable': '1:1',
    'cuisine': 'Indian',
    'category_name': 'Appeteasers',
    'discount': {
      'type': '',
      'amount': '0.00'
    },
    'tags': []
  }
 */

/**
 *
 * @param restaurantId
 * @return {JSX.Element}
 * @constructor
 */
export function MenuItems({ restaurantId }) {

  const dispatch = useDispatch();
  const menuState = useSelector(accessRestaurantMenuState(restaurantId));
  const emptyArr = useMemo(() => ([]), []);
  const menuList = useSelector(accessMenuForRestaurant(restaurantId, emptyArr));
  const cartItems = useSelector(accessCartItems());
  const cartItemsMap = useMemo(() => createMap(cartItems, i => i.id), [ cartItems ]);
  const dataSource = useMemo(() => menuList.map(item => cartItemsMap.has(item.id) ?
    Object.assign({ cart: cartItemsMap.get(item.id) }, item) :
    item), [ cartItemsMap, menuList ]);
  const orderId = useSelector(accessCart('orderId'));

  useEffect(() => {
    if (menuState) {
      return;
    }
    dispatch(retrieveRestaurantByIdAsyncThunk({ restaurantId }));
  }, [ dispatch, menuState, restaurantId ]);

  useEffect(() => {
    if (orderId) {
      return;
    }
    dispatch(obtainCartAsyncThunk());
  }, [ orderId, dispatch ]);


  const handleAddToCart = useUpdateCartHandler(orderId, cartItemsMap, restaurantId);

  const actionColumnFormatter = useCallback((cellContent, row, rowId, orderId) => {
    if (row.cart) {
      const cartItem = row.cart;
      return <Button color={ 'success' } size={ 'sm' } disabled={ !orderId || (cartItem.oldCount !== undefined) }
        onClick={ handleAddToCart(row.id, row, cartItem, 1) } { ...e2eAssist.BTN_ADD_TO_CART_ADDED }><IconPlus /></Button>;
    }
    return <Button color={ 'info' } size={ 'sm' } disabled={ !orderId }
      onClick={ handleAddToCart(row.id, row, null, 1) } { ...e2eAssist.BTN_ADD_TO_CART_FRESH }><IconCartPlus /></Button>;
  }, [ handleAddToCart ]);

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
      text: 'Add To Cart',
      formatter: actionColumnFormatter,
      formatExtraData: orderId,
      classes: 'text-right'
    }
  ]), [ actionColumnFormatter, orderId ]);

  const defaultSorted = [ {
    dataField: 'name',
    order: 'desc'
  } ];

  const prevcartId = usePrevious(orderId);
  console.log(prevcartId, ' => ', orderId);

  if (menuState !== 'ready') {
    return <>Updating the menu...</>;
  }

  return <PaginatedTable
    bootstrap4
    hover
    keyField="id"
    data={ dataSource }
    noDataIndication={ <span { ...e2eAssist.INFO_MENU_IS_EMPTY }>Menu is temporarily empty</span> }
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
    { ...e2eAssist.TBL_RESTAURANT_MENU }
  />;

}
