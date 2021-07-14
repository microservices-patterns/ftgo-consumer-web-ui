import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import React from 'react';
import { CheckoutForm } from './checkoutForm';
import { e2eAssist } from '../../../testability';

//import { Elements } from '@stripe/react-stripe-js';
//import { loadStripe } from '@stripe/stripe-js';
//const stripePromise = loadStripe(ensureEnvVariable('REACT_APP_STRIPE_PK_KEY'));

export const PaymentModal = ({ show, toggle, showDismiss }) => {
  //  return <Elements stripe={ stripePromise }>
  return <Modal isOpen={ show } toggle={ toggle } { ...e2eAssist.MODAL_PAYMENT }>
    <ModalHeader toggle={ toggle }>Payment Details:</ModalHeader>
    <ModalBody>
      <CheckoutForm />
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={ toggle } { ...e2eAssist.BTN_MODAL_PAYMENT_DISMISS_FN(showDismiss ? 'dismiss' : 'cancel') }
      >{ showDismiss ? 'Dismiss' : 'Cancel' }</Button>
    </ModalFooter>
  </Modal>;
  //  </Elements>;
};


