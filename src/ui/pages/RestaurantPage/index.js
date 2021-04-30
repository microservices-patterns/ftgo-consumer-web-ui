import { accessSelectedRestaurant } from '../../../features/restaurants/restaurantsSlice';
import { useSelector } from 'react-redux';
import { SelectedAddressRow } from '../../components/SelectedAddressRow';
import { Container } from 'reactstrap';

export const RestaurantPage = (props) => {
  const selectedRestaurant = useSelector(accessSelectedRestaurant());
  console.log(props, selectedRestaurant);
  debugger;

  return <div style={ { marginTop: '-1rem' } }>
    <SelectedAddressRow />
    <Container><pre>Selected Restaurant ID:
      {
        selectedRestaurant
      }</pre>
    </Container>
  </div>;
};

export default RestaurantPage;
