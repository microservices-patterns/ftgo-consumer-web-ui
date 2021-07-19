import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  accessCart,
  accessCartItems,
  accessCartStatus,
  accessPaymentSuccessful,
  accessVerboseCartInfo
} from '../../../features/cart/cartSlice';
import {
  navigateToEditDeliveryAddress,
  navigateToEditMenu,
  navigateToPickRestaurants,
  navigateToThankYou
} from '../../../features/actions/navigation';
import { Button, Col, Container, Row } from 'reactstrap';
import { accessSelectedRestaurantId } from '../../../features/restaurants/restaurantsSlice';
import { e2eAssist } from '../../../testability';
import { SelectedAddressRow } from '../../components/SelectedAddressRow';
import { SelectedRestaurantRow } from '../../components/SelectedRestaurantRow';
import { YourTrayItems } from '../RestaurantPage/yourTrayItems';
import { OrderInfo } from './orderInfo';
import { PaymentModal } from './paymentModal';
import { accessIsLoading } from '../../../features/ui/loadingSlice';


const CheckoutPage = () => {
  const dispatch = useDispatch();
  const cartStatus = useSelector(accessCartStatus());
  const cartItems = useSelector(accessCartItems());
  const cartId = useSelector(accessCart('id'));
  const selectedRestaurantId = useSelector(accessSelectedRestaurantId());
  const verboseCartInfo = useSelector(accessVerboseCartInfo());
  const recentPaymentSuccess = useSelector(accessPaymentSuccessful());
  const isLoading = useSelector(accessIsLoading());

  useEffect(() => {
    if (!selectedRestaurantId) {
      return;
    }
    if (cartItems.length) {
      return;
    }
    dispatch(navigateToEditMenu(selectedRestaurantId));
  }, [ cartItems.length, dispatch, selectedRestaurantId ]);

  useEffect(() => {
    if (!selectedRestaurantId) {
      dispatch(navigateToEditDeliveryAddress());
    }
  }, [ dispatch, selectedRestaurantId ]);

  const handleChangeTray = useCallback(() => {
    dispatch(navigateToEditMenu(selectedRestaurantId));
  }, [ dispatch, selectedRestaurantId ]);

  const [ showPaymentModal, setShowPaymentModal ] = useState(false);

  const toggle = useCallback(() => {
    setShowPaymentModal(!showPaymentModal);
    if (recentPaymentSuccess !== true) {
      debugger;
      return;
    }
    dispatch(navigateToThankYou());
  }, [ dispatch, recentPaymentSuccess, showPaymentModal ]);

  const handleRequestPayment = useCallback(() => {
    setShowPaymentModal(true);
  }, []);


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
    debugger;
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
        <Col className="text-right" md={ 10 }><Button onClick={ handleChangeTray } outline size="sm" { ...e2eAssist.BTN_CHECKOUT_MODIFY_CART }>+ Add More Items</Button></Col>
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
        <Col className="text-right pt-4" md={ 10 }><Button onClick={ isLoading ? null : handleRequestPayment } disabled={ isLoading } color="primary"
          { ...e2eAssist.BTN_INVOKE_PAYMENT_MODAL }>Pay { String(verboseCartInfo.total ?? '') }</Button></Col>
      </Row>

    </Container>
    <PaymentModal show={ showPaymentModal } toggle={ toggle } showDismiss={ recentPaymentSuccess === true } />
  </div>;
};

export default CheckoutPage;
