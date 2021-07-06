import {
  accessDeliveryAddress,
  accessDeliveryTime,
  accessRestaurantsList,
  retrieveRestaurantsForAddress
} from '../../../features/address/addressSlice';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useMemo } from 'react';
import { navigateToEditMenu } from '../../../features/actions/navigation';
import { Col, Container } from 'reactstrap';
import { LessLargeTextDiv } from '../../elements/textElements';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { keepSelectedRestaurant } from '../../../features/restaurants/restaurantsSlice';
import { SelectedAddressRow } from '../../components/SelectedAddressRow';
import { PaginatedTable } from '../../elements/paginatedTable';
import { resetCart } from '../../../features/cart/cartSlice';
import { e2eAssist } from '../../../testability';

export const RestaurantListPage = () => {

  const dispatch = useDispatch();
  const deliveryAddress = useSelector(accessDeliveryAddress());
  const deliveryTime = useSelector(accessDeliveryTime());
  const restaurants = useSelector(accessRestaurantsList());

  useEffect(() => {
    if (restaurants) {
      return;
    }
    if (!deliveryAddress || !deliveryTime) {
      return;
    }
    dispatch(retrieveRestaurantsForAddress({ address: deliveryAddress, time: deliveryTime }));
  }, [ deliveryAddress, deliveryTime, dispatch, restaurants ]);


  const columns = [ {
    dataField: 'id',
    text: 'Ref ID',
    sort: true
  }, {
    dataField: 'name',
    text: 'Restaurant',
    sort: true
  }, {
    dataField: 'cuisine',
    text: 'Cuisine',
    sort: true
  }, {
    dataField: 'address',
    text: 'Address',
    sort: true
  } ];

  const defaultSorted = [ {
    dataField: 'name',
    order: 'desc'
  } ];

  const handleRowSelect = useCallback((entry) => {
    dispatch(keepSelectedRestaurant(entry));
    dispatch(resetCart());
    entry?.id && dispatch(navigateToEditMenu(entry.id));
  }, [ dispatch ]);

  const selectRow = useMemo(() => ({
    mode: 'radio',
    clickToSelect: true,
    selectionHeaderRenderer: () => null,
    selectionRenderer: ({ mode, ...rest }) => null,
    style: { backgroundColor: '#c8e6c980' },
    onSelect: handleRowSelect
  }), [ handleRowSelect ]);

  return <div style={ { marginTop: '-1rem' } } { ...e2eAssist.PAGE_RESTAURANTS_LIST }>
    <SelectedAddressRow />
    <Container className="d-flex">
      <Col sm={ 3 }>
        <LessLargeTextDiv size={ 2.5 } className="mb-2">Restaurants:</LessLargeTextDiv>
        <LessLargeTextDiv size={ 1.25 }>Listing: <strong { ...e2eAssist.TEXT_RESTAURANTS_LIST_SIZE } >{ String(restaurants?.length ?? 0) }</strong></LessLargeTextDiv>
      </Col>
      <Col sm={ 9 } className="py-2">
        <PaginatedTable
          bootstrap4
          hover
          keyField="id"
          data={ restaurants || [] }
          noDataIndication={ <>No restaurants</> }
          columns={ columns }
          defaultSorted={ defaultSorted }
          selectRow={ selectRow }
          bordered={ false }
          paginationOnTop
          { ...e2eAssist.TBL_RESTAURANTS_LIST }
          paginationFactoryOptions={ {
            custom: true,
            sizePerPage: 5,
            sizePerPageList: [ 5, 10, 25, 30, 50 ],
            hidePageListOnlyOnePage: true
          } }
        />
      </Col>
    </Container>

  </div>;
};

export default RestaurantListPage;

