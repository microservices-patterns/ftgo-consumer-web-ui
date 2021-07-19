import { useSelector } from 'react-redux';
import { accessCart, accessCartInfo, accessCartStatus, accessVerboseCartInfo } from '../../../features/cart/cartSlice';

export const OrderInfo = () => {

  const orderId = useSelector(accessCart('orderId'));
  const cartStatus = useSelector(accessCartStatus());
  const verboseCartInfo = useSelector(accessVerboseCartInfo());
  const cartInfo = useSelector(accessCartInfo());
  console.log('[cartInfo]', cartInfo);

  void orderId;
  void cartStatus;

  const { total, subTotal, tax, delivery } = verboseCartInfo;
  const { taxAmount } = cartInfo;

  return <>
    <div className="row pt-2">
      <div className="col-6">Subtotal:</div>
      <div className="col-6 text-right">{ subTotal }</div>
    </div>
    <div className="row pt-2">
      <div className="col-6">Delivery Fee:</div>
      <div className="col-6 text-right">{ delivery }</div>
    </div>
    <div className="row pt-2">
      <div className="col-6">Fees & Estimated Tax ({ (100 * taxAmount).toFixed(2) }%):</div>
      <div className="col-6 text-right">{ tax }</div>
    </div>
    <div className="row pt-2">
      <div className="col-6">Total:</div>
      <div className="col-6 text-right">{ total }</div>
    </div>
  </>;
};
