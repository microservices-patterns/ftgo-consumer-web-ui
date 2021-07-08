import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import React from 'react';
import { CheckoutForm } from './checkoutForm';

//import { Elements } from '@stripe/react-stripe-js';
//import { loadStripe } from '@stripe/stripe-js';
//const stripePromise = loadStripe(ensureEnvVariable('REACT_APP_STRIPE_PK_KEY'));

export const PaymentModal = ({ show, toggle, showDismiss }) => {
  //  return <Elements stripe={ stripePromise }>
  return <Modal isOpen={ show } toggle={ toggle }>
    <ModalHeader toggle={ toggle }>Payment Details:</ModalHeader>
    <ModalBody>
      <CheckoutForm />
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={ toggle }>{ showDismiss ? 'Dismiss' : 'Cancel' }</Button>
    </ModalFooter>
  </Modal>;
  //  </Elements>;
};


