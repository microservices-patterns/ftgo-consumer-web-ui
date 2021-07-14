import { Container } from 'reactstrap';
import { e2eAssist } from '../../../testability';
import React from 'react';

export const ThankYouPage = () => {
  return <div style={ { marginTop: '-1rem' } } { ...e2eAssist.PAGE_THANKYOU }>

    <Container>
      <h3>Thank You For Placing Your Order!</h3>
    </Container>
  </div>;
};

export default ThankYouPage;
