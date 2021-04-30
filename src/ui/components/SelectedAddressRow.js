import { useDispatch, useSelector } from 'react-redux';
import { accessDeliveryAddress, accessDeliveryTime, resetAddressAndTime } from '../../features/address/addressSlice';
import { useCallback, useEffect } from 'react';
import { navigateToEditDeliveryAddress } from '../../features/actions/navigation';
import { Col, Container } from 'reactstrap';
import { RoundedButton } from '../elements/formElements';
import { Span } from '../elements/textElements';
import { IconEdit } from '../elements/icons';

export const SelectedAddressRow = () => {

  const dispatch = useDispatch();
  const deliveryAddress = useSelector(accessDeliveryAddress());
  const deliveryTime = useSelector(accessDeliveryTime());

  useEffect(() => {
    if (deliveryAddress && deliveryTime) {
      return;
    }
    dispatch(resetAddressAndTime());
    dispatch(navigateToEditDeliveryAddress());
  }, [ deliveryAddress, deliveryTime, dispatch ]);

  const handleEditAddress = useCallback(() => {
    dispatch(navigateToEditDeliveryAddress());
  }, [ dispatch ]);


  return (<div className="navbar-shadow navbar">
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
  </div>);
};
