import { SelectedAddressRow } from '../../components/SelectedAddressRow';
import { Col, Container } from 'reactstrap';
import { SelectedRestaurantRow } from '../../components/SelectedRestaurantRow';

export const RestaurantPage = () => {

  return <div style={ { marginTop: '-1rem' } }>
    <SelectedAddressRow />
    <SelectedRestaurantRow />
    <Container className="d-flex">
      <Col sm={ 8 }>Menu Items:</Col>
      <Col sm={ 4 }>Your Tray:</Col>
    </Container>
  </div>;
};

export default RestaurantPage;
