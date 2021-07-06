import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { accessCart, accessCartItems, accessCartStatus } from '../../../features/cart/cartSlice';
import { navigateToEditMenu, navigateToPickRestaurants } from '../../../features/actions/navigation';
import { Button, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { accessSelectedRestaurantId } from '../../../features/restaurants/restaurantsSlice';
import { e2eAssist } from '../../../testability';
import { SelectedAddressRow } from '../../components/SelectedAddressRow';
import { SelectedRestaurantRow } from '../../components/SelectedRestaurantRow';
import { YourTrayItems } from '../RestaurantPage/yourTrayItems';
import { OrderInfo } from './orderInfo';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const cartStatus = useSelector(accessCartStatus());
  const cartItems = useSelector(accessCartItems());
  const cartId = useSelector(accessCart('id'));
  const selectedRestaurantId = useSelector(accessSelectedRestaurantId());

  const handleChangeTray = useCallback(() => {
    dispatch(navigateToEditMenu(selectedRestaurantId));
  }, [ dispatch, selectedRestaurantId ]);

  const [ showPaymentModal, setShowPaymentModal ] = useState(false);

  const toggle = useCallback(() => setShowPaymentModal(!showPaymentModal), [ showPaymentModal ]);
  const handleRequestPayment = useCallback(() => {
    setShowPaymentModal(true);
  }, []);

  void cartItems;

  useEffect(() => {
    if (!showPaymentModal) {
      return;
    }
    // fetch("/create-payment-intent", {
    //  method: "POST",
    //  headers: {
    //    "Content-Type": "application/json"
    //  },
    //  body: JSON.stringify(purchase)
    //})
  }, [ showPaymentModal ]);

  useEffect(() => {
    if (cartId || (cartStatus !== 'ready')) {
      return null;
    }
    if (selectedRestaurantId) {
      //dispatch(navigateToEditMenu(selectedRestaurantId));
      void dispatch;
      void navigateToEditMenu;
      void selectedRestaurantId;
    } else {
      //dispatch(navigateToPickRestaurants());
      void navigateToPickRestaurants;
    }
  }, [ cartId, cartStatus, dispatch, selectedRestaurantId ]);

  if (!cartId || (cartStatus !== 'ready')) {
    return null;
  }

  return <div style={ { marginTop: '-1rem' } } { ...e2eAssist.PAGE_CHECKOUT }>
    <SelectedAddressRow />
    <SelectedRestaurantRow />
    <Container>
      <Row>
        <Col xs={ 12 } className="offset-md-3 pt-4" md={ 9 }>
          <h2>Your Order</h2>
        </Col>
      </Row>
      <Row>
        <Col md={ 3 }>
          <h3 className="text-muted text-right">Items:</h3>
        </Col>
        <Col md={ 7 }>
          <YourTrayItems checkout />
        </Col>
      </Row>
      <Row>
        <Col className="text-right" md={ 10 }><Button onClick={ handleChangeTray } outline size="sm">+ Add More Items</Button></Col>
      </Row>
      <Row>
        <Col md={ 3 } className="pt-4">
          <h3 className="text-muted text-right">Summary:</h3>
        </Col>
        <Col md={ 7 } className="pb-2 pt-4">
          <OrderInfo />
        </Col>
      </Row>
      <Row>
        <Col className="text-right pt-4" md={ 10 }><Button onClick={ handleRequestPayment } color="primary">Pay $00.0</Button></Col>
      </Row>

    </Container>
    <Modal isOpen={ showPaymentModal } toggle={ toggle }>
      <ModalHeader toggle={ toggle }>Payment Details:</ModalHeader>
      <ModalBody>
        StripeElements
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={ toggle }>Confirm Payment</Button>{ ' ' }
        <Button color="secondary" onClick={ toggle }>Cancel</Button>
      </ModalFooter>
    </Modal>
  </div>;
};

export default CheckoutPage;
