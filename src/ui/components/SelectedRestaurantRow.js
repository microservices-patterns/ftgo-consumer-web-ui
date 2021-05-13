import { useDispatch, useSelector } from 'react-redux';
import { accessSelectedRestaurantId } from '../../features/restaurants/restaurantsSlice';
import { Col, Container } from 'reactstrap';
import { RoundedButton } from '../elements/formElements';
import { Span } from '../elements/textElements';
import { IconEdit } from '../elements/icons';
import { useCallback } from 'react';
import { navigateToPickRestaurants } from '../../features/actions/navigation';
import { accessRestaurantInfo } from '../../features/address/addressSlice';

export function SelectedRestaurantRow() {

  const dispatch = useDispatch();
  const selectedRestaurantId = useSelector(accessSelectedRestaurantId());
  const selectedRestaurant = useSelector(accessRestaurantInfo(selectedRestaurantId));
  const handleChangeRestaurant = useCallback(() => {
    dispatch(navigateToPickRestaurants());
  }, [ dispatch ]);

  return (<div className="navbar-shadow navbar">
    <Container>
      <Col sm={ 5 }>
        <label className="font-weight-bold small">Restaurant:</label>
        <div style={ { marginBottom: '0' } }>{ selectedRestaurant?.name ?? 'No Restaurant' }</div>
      </Col><Col sm={ 5 }>
      <label className="font-weight-bold small">Address:</label>
      <address style={ { marginBottom: '0' } }>{ selectedRestaurant?.address ?? 'No Address' }</address>
    </Col><Col sm={ 2 } className="text-right">
      <RoundedButton title="Change restaurant" color="secondary" outline onClick={ handleChangeRestaurant }><Span centerEditIcon><IconEdit /></Span></RoundedButton></Col>
    </Container>
  </div>);
}
