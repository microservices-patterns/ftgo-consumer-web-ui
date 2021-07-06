import { useSelector } from 'react-redux';
import { accessCart, accessCartItems, accessCartStatus } from '../../../features/cart/cartSlice';
import { useMemo } from 'react';

export const OrderInfo = () => {

  const cartId = useSelector(accessCart('id'));
  const cartStatus = useSelector(accessCartStatus());
  const cartItems = useSelector(accessCartItems());
  void cartId;
  void cartStatus;

  const subTotal = useMemo(() => cartItems.reduce((memo, item) => memo + item.price * item.count, 0), [ cartItems ]);

  return <>
    <div className="row pt-2">
      <div className="col-6">Subtotal:</div>
      <div className="col-6 text-right">${ subTotal }</div>
    </div>
    <div className="row pt-2">
      <div className="col-6">Delivery Fee:</div>
      <div className="col-6 text-right">$0.00</div>
    </div>
    <div className="row pt-2">
      <div className="col-6">Fees & Estimated Tax:</div>
      <div className="col-6 text-right">$0.00</div>
    </div>
    <div className="row pt-2">
      <div className="col-6">Total:</div>
      <div className="col-6 text-right">$0.00</div>
    </div>
  </>;
};
