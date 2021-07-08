import { Input, InputGroup, InputGroupText } from 'reactstrap';
import { useCallback, useEffect, useMemo, useState } from 'react';
import curry from 'lodash-es/curry';
import { accessCardValue, resetCard, updateCardValue } from '../../../features/card/cardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { forTimeout } from '../../../shared/promises';

export const useElements = () => {
  const cardValue = useSelector(accessCardValue());
  const getCardValue = useCallback(() => cardValue, [ cardValue ]);
  return useMemo(() => ({
    getCardValue
  }), [ getCardValue ]);
};

export const useStripe = () => {
  return useMemo(() => ({
    confirmCardPayment(clientSecret, data) {
      const {
        payment_method: {
          card //: elements.getElement(CardElement)
        }
      } = data;

      console.log('[stripe.confirmCardPayment]', clientSecret, card);


      // 4242 4242 4242 4242 - Payment succeeds
      // 4000 0025 0000 3155 - Payment requires authentication
      // 4000 0000 0000 9995 - Payment is declined


      if (/^4242\s*4242\s*4242\s*4242$/.test(card?.card_number ?? '')) {
        return forTimeout(1000, {
          error: false
        });
      }
      else if (/^4000\s*0025\s*0000\s*3155$/.test(card?.card_number ?? '')) {
        const isOdd = (new Date().getTime() % 2) === 0;
        return forTimeout(3500, {
          error: isOdd && {
            message: 'Payment requires authentication. The odds now are for simulating an error. Try again for successful payment.'
          }
        });
      }
      else if (/^4000\s*0000\s*0000\s*9995$/.test(card?.card_number ?? '')) {
        return forTimeout(3000, {
          error: {
            message: 'Payment is declined'
          }
        });
      } else {
        return forTimeout(1000, {
          error: false
        });
      }

    }
  }), []);
};

export const CardElement = ({ errors, onChange, options = {} }) => {

  const [ ccNumber, setCCNumber ] = useState('');
  const [ expMonth, setExpMonth ] = useState('');
  const [ expYear, setExpYear ] = useState('');
  const [ cvv, setCvv ] = useState('');
  const [ zip, setZip ] = useState('');

  const { style } = options;
  const baseStyle = style?.base ?? {};
  const invalidStyle = style?.invalid ?? {};

  const onChangeHandler = useMemo(() => curry((setter, evt) => {
    setter(evt.target.value);
  }), []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetCard());
  }, [ dispatch ]);

  const isEmpty = useMemo(() => [ ccNumber, cvv, expMonth, expYear, zip ].every(val => !val),
    [ ccNumber, cvv, expMonth, expYear, zip ]);

  useEffect(() => {

    const card = {
      card_number: ccNumber,
      exp_month: expMonth,
      exp_year: expYear,
      cvv,
      zip
    };
    onChange && onChange({
      empty: isEmpty,
      error: null,
      card
    });
    dispatch(updateCardValue({ card, isEmpty }));
  }, [ ccNumber, cvv, dispatch, expMonth, expYear, isEmpty, onChange, zip ]);

  return <>
    <Input className="mb-1" placeholder="Card Number" name="card_number" type="number" value={ ccNumber } onChange={ onChangeHandler(setCCNumber) }
      { ...(errors?.card_number ? { invalid: true } : {}) }
      style={ Object.assign({}, baseStyle, errors?.card_number ? invalidStyle : {}) }
    />
    <InputGroup className="mb-1">
      <Input placeholder="Expires Month" name="exp_month" type="number" value={ expMonth } onChange={ onChangeHandler(setExpMonth) }
        { ...(errors?.exp_month ? { invalid: true } : {}) }
        style={ Object.assign({}, baseStyle, errors?.exp_month ? invalidStyle : {}) }
      />
      <InputGroupText>/</InputGroupText>
      <Input placeholder="Year" name="exp_year" type="number" value={ expYear } onChange={ onChangeHandler(setExpYear) }
        { ...(errors?.exp_year ? { invalid: true } : {}) }
        style={ Object.assign({}, baseStyle, errors?.exp_year ? invalidStyle : {}) }
      />
    </InputGroup>
    <InputGroup className="mb-1">
      <Input placeholder="CVV" name="cvv" type="number" value={ cvv } onChange={ onChangeHandler(setCvv) }
        { ...(errors?.cvv ? { invalid: true } : {}) }
        style={ Object.assign({}, baseStyle, errors?.cvv ? invalidStyle : {}) }
      />
      <Input placeholder="ZIP" name="zip" type="number" value={ zip } onChange={ onChangeHandler(setZip) }
        { ...(errors?.zip ? { invalid: true } : {}) }
        style={ Object.assign({}, baseStyle, errors?.zip ? invalidStyle : {}) }
      />
    </InputGroup>
    <div className="mb-1 text-muted">
      Try using these values for the card:
      <pre className="d-block">
        4242 4242 4242 4242 - Payment succeeds
        <br/>
        4000 0025 0000 3155 - Payment requires authentication
        <br/>

        4000 0000 0000 9995 - Payment is declined
      </pre>
    </div>
  </>
    ;
};

