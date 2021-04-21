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
import { Col, Row } from 'reactstrap';
import { Span } from '../../elements/textElements';
import { RoundedButton } from '../../elements/formElements';

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

  return <div>
    <Row><Col sm={ 6 }>
      <label className="font-weight-bold small">Deliver To:</label>
      <address>{ deliveryAddress }</address>
    </Col><Col sm={ 4 }>
      <label className="font-weight-bold small">Deliver At:</label>
      <div>
        <time dateTime={ deliveryTime }>{ deliveryTime }</time>
      </div>
    </Col><Col sm={ 2 } className="text-right"><RoundedButton title="Edit delivery address and time" color="secondary" outline onClick={ handleEditAddress }><Span centerEditIcon><IconEdit /></Span></RoundedButton></Col></Row>

  </div>;
};

export default RestaurantListPage;
