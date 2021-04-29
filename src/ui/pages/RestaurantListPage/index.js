import {
  accessDeliveryAddress,
  accessDeliveryTime,
  accessRestaurantsList,
  resetAddressAndTime,
  retrieveRestaurantsForAddress
} from '../../../features/address/addressSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { navigateToEditDeliveryAddress } from '../../../features/actions/navigation';
import { IconEdit } from '../../elements/icons';
import { Col, Container, Row } from 'reactstrap';
import { LessLargeTextDiv, Span } from '../../elements/textElements';
import { RoundedButton } from '../../elements/formElements';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
a
export const RestaurantListPage = () => {

  const dispatch = useDispatch();
  const deliveryAddress = useSelector(accessDeliveryAddress());
  const deliveryTime = useSelector(accessDeliveryTime());
  const restaurants = useSelector(accessRestaurantsList());

  useEffect(() => {
    if (deliveryAddress && deliveryTime) {
      return;
    }
    dispatch(resetAddressAndTime());
    dispatch(navigateToEditDeliveryAddress());
  }, [ deliveryAddress, deliveryTime, dispatch ]);

  useEffect(() => {
    if (restaurants) {
      return;
    }
    debugger;
    dispatch(retrieveRestaurantsForAddress({ address: deliveryAddress, time: deliveryTime }));

  }, [ deliveryAddress, deliveryTime, dispatch, restaurants ]);

  const handleEditAddress = useCallback(() => {
    dispatch(navigateToEditDeliveryAddress());
  }, [ dispatch ]);

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

  return <div style={ { marginTop: '-1rem' } }>
    <div className="navbar-shadow navbar">
      <Container>
        <Col sm={ 6 }>
          <label className="font-weight-bold small">Deliver To:</label>
          <address style={ { marginBottom: '0' } }>{ deliveryAddress }</address>
        </Col><Col sm={ 4 }>
        <label className="font-weight-bold small">Deliver At:</label>
        <div>
          <time dateTime={ deliveryTime }>{ deliveryTime }</time>
        </div>
      </Col><Col sm={ 2 } className="text-right">
        <RoundedButton title="Edit delivery address and time" color="secondary" outline onClick={ handleEditAddress }><Span centerEditIcon><IconEdit /></Span></RoundedButton></Col>
      </Container>
    </div>
    <Container>
      <Row>
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
            bordered={ false }
          />
        </Col>
      </Row>
    </Container>

  </div>;
};

export default RestaurantListPage;

