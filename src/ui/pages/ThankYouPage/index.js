import { Container } from 'reactstrap';
import { e2eAssist } from '../../../testability';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { accessCart, accessVerboseCartInfo } from '../../../features/cart/cartSlice';
import { navigateToEditDeliveryAddress } from '../../../features/actions/navigation';

export const ThankYouPage = () => {
  const verboseCartInfo = useSelector(accessVerboseCartInfo());
  const orderId = useSelector(accessCart('orderId'));
  const dispatch = useDispatch();

  useEffect(() => {
    if (!orderId) {
      dispatch(navigateToEditDeliveryAddress());
    }
  }, [ dispatch, orderId ]);

  return <div { ...e2eAssist.PAGE_THANKYOU }>
    <Container>
      <h3>Thank You For Placing Your Order!</h3>
      <div className="">Your order <div className="text-monospace font-weight-bold my-2" { ...e2eAssist.TEXT_ORDER_ID_FN(orderId) }>#{ orderId }</div> for the amount of <div className="font-weight-bold my-2">{ verboseCartInfo.total }</div> has been placed and is being processed.
      </div>
    </Container>
  </div>;
};

export default ThankYouPage;
