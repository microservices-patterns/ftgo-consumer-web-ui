import {
  accessDeliveryAddress,
  accessDeliveryTime,
  accessRestaurantsList,
  retrieveRestaurantsForAddress
} from '../../../features/address/addressSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import { navigateToEditMenu } from '../../../features/actions/navigation';
import { Col, Container } from 'reactstrap';
import { LessLargeTextDiv } from '../../elements/textElements';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { keepSelectedRestaurant } from '../../../features/restaurants/restaurantsSlice';
import { SelectedAddressRow } from '../../components/SelectedAddressRow';

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
    entry?.id && dispatch(navigateToEditMenu(entry.id));
  }, [ dispatch ]);

  const selectRow = useMemo(() => ({
    mode: 'radio',
    clickToSelect: true,
    onSelect: handleRowSelect
  }), [ handleRowSelect ]);

  return <div style={ { marginTop: '-1rem' } }>
    <SelectedAddressRow />
    <Container className="d-flex">
      <Col sm={ 3 }>
        <LessLargeTextDiv size={ 2.5 } className="mb-2">Restaurants:</LessLargeTextDiv>
        <LessLargeTextDiv size={ 1.25 }>Listing: <strong>{ String(restaurants?.length ?? 0) }</strong></LessLargeTextDiv>
      </Col>
      <Col sm={ 9 } className="py-2">
        <BootstrapTable
          bootstrap4
          keyField="id"
          data={ restaurants || [] }
          noDataIndication={ <>No restaurants</> }
          columns={ columns }
          defaultSorted={ defaultSorted }
          selectRow={ selectRow }
          bordered={ false }
        />
      </Col>
    </Container>

  </div>;
};

export default RestaurantListPage;

