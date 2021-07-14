import { Input, InputGroup, InputGroupText } from 'reactstrap';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import curry from 'lodash-es/curry';
import { accessCardValue, resetCard, updateCardValue } from '../../../features/card/cardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { postConfirmPaymentAsyncThunk } from '../../../features/cart/cartSlice';
import { e2eAssist } from '../../../testability';

export const useElements = () => {
  const cardValue = useSelector(accessCardValue());
  const getCardValue = useCallback(() => cardValue, [ cardValue ]);
  return useMemo(() => ({
    getCardValue
  }), [ getCardValue ]);
};

export const useStripe = () => {
  const dispatch = useDispatch();

  return useMemo(() => ({
    async confirmCardPayment(clientSecret, data) {
      const {
        payment_method: {
          card //: elements.getElement(CardElement)
        }
      } = data;

      console.log('[stripe.confirmCardPayment]', clientSecret, card);

      const response = await dispatch(postConfirmPaymentAsyncThunk({ clientSecret, card }));
      const { error, payload } = response;
      console.log(error, payload);
      return payload;
    }
  }), [ dispatch ]);
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
      { ...e2eAssist.FLD_FORM_PAYMENT_FN('card_number', ...(errors?.card_number ? [ 'invalid' ] : [])) }
    />
    <InputGroup className="mb-1">
      <Input placeholder="Expires Month" name="exp_month" type="number" value={ expMonth } onChange={ onChangeHandler(setExpMonth) }
        { ...(errors?.exp_month ? { invalid: true } : {}) }
        style={ Object.assign({}, baseStyle, errors?.exp_month ? invalidStyle : {}) }
        { ...e2eAssist.FLD_FORM_PAYMENT_FN('exp_month', ...(errors?.exp_month ? [ 'invalid' ] : [])) }
      />
      <InputGroupText>/</InputGroupText>
      <Input placeholder="Year" name="exp_year" type="number" value={ expYear } onChange={ onChangeHandler(setExpYear) }
        { ...(errors?.exp_year ? { invalid: true } : {}) }
        style={ Object.assign({}, baseStyle, errors?.exp_year ? invalidStyle : {}) }
        { ...e2eAssist.FLD_FORM_PAYMENT_FN('exp_year', ...(errors?.exp_year ? [ 'invalid' ] : [])) }
      />
    </InputGroup>
    <InputGroup className="mb-1">
      <Input placeholder="CVV" name="cvv" type="number" value={ cvv } onChange={ onChangeHandler(setCvv) }
        { ...(errors?.cvv ? { invalid: true } : {}) }
        style={ Object.assign({}, baseStyle, errors?.cvv ? invalidStyle : {}) }
        { ...e2eAssist.FLD_FORM_PAYMENT_FN('cvv', ...(errors?.cvv ? [ 'invalid' ] : [])) }
      />
      <Input placeholder="ZIP" name="zip" type="number" value={ zip } onChange={ onChangeHandler(setZip) }
        { ...(errors?.zip ? { invalid: true } : {}) }
        style={ Object.assign({}, baseStyle, errors?.zip ? invalidStyle : {}) }
        { ...e2eAssist.FLD_FORM_PAYMENT_FN('zip', ...(errors?.zip ? [ 'invalid' ] : [])) }
      />
    </InputGroup>
    <div className="mb-1 text-muted">
      Try using these values for the card:
      <pre className="d-block text-muted">
        4242 4242 4242 4242 - Payment succeeds
        <br />
        4000 0025 0000 3155 - Payment requires authentication
        <br />

        4000 0000 0000 9995 - Payment is declined
      </pre>
    </div>
  </>
    ;
};

