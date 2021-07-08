import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Elements } from '@stripe/react-stripe-js';
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutForm } from './checkoutForm';
import { ensureEnvVariable } from '../../../shared/env';

const stripePromise = loadStripe(ensureEnvVariable('REACT_APP_STRIPE_PK_KEY'));

export const PaymentModal = ({ show, toggle, showDismiss }) => {
  return <Elements stripe={ stripePromise }><Modal isOpen={ show } toggle={ toggle }>
    <ModalHeader toggle={ toggle }>Payment Details:</ModalHeader>
    <ModalBody>
      <CheckoutForm />
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={ toggle }>{ showDismiss ? 'Dismiss' : 'Cancel' }</Button>
    </ModalFooter>
  </Modal></Elements>;
};


