import { useForm } from 'react-hook-form';
import React, { useCallback } from 'react';
import { Col, Form, FormFeedback, FormGroup } from 'reactstrap';
import { InputWithIcon, RoundedButton } from '../../elements/formElements';
import { IconClock, IconGeo, IconRefresh, IconSearch } from '../../elements/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  accessDeliveryAddress,
  accessDeliveryTime,
  retrieveRestaurantsForAddress
} from '../../../features/address/addressSlice';
import { If } from '../../elements/conditions';

function processFormSubmissionError(effectiveError, setError, clearErrors) {
  if (!effectiveError) {
    clearErrors && clearErrors();
    return;
  }
  if (effectiveError.errors) {
    ((Array.isArray(effectiveError.errors) && effectiveError.errors.every(Array.isArray)) ?
      effectiveError.errors :
      Array.from(Object.entries(effectiveError.errors))).forEach(([ key, value ]) =>
      setError(key, { type: 'server', message: value ?? 'Server-side error we cannot explain' }));
  } else {
    setError('form', { type: 'server', message: effectiveError.message ?? 'Server error' });
  }
}

export const LandingPageForm = () => {

  const deliveryAddress = useSelector(accessDeliveryAddress());
  const deliveryTime = useSelector(accessDeliveryTime());

  const { register, handleSubmit, setError, clearErrors, formState: { isSubmitting, errors } } = useForm({
    // a bug. In the presence of the below resolver, it is possible to resubmit after errors
    // however, the required fields validation is not taking place
    // TODO: resolve this dualistic condition
    resolver: (values, ctx, options) => {
      return ({
        values, errors: {}
      });
    },
    defaultValues: {
      address: deliveryAddress,
      time: deliveryTime
    }
  });

  const dispatch = useDispatch();
  const onSubmit = useCallback(async data => {

    const payload = await dispatch(retrieveRestaurantsForAddress({ ...data }));

    payload.error && processFormSubmissionError((payload.meta.rejectedWithValue ?
      payload.payload :
      payload.error), setError, clearErrors);

  }, [ setError, dispatch, clearErrors ]);

  return <Form className="col-md-6 offset-md-3" method="post" onSubmit={ handleSubmit(onSubmit) }>

    <FormGroup>
      . <InputWithIcon type="text" tag={ props => (
      <input type="text" { ...props } required aria-required="true" { ...register('address', {
        required: true
      }) } />) } invalid={ !!(errors.address) } disabled={ isSubmitting } bsSize="lg" placeholder="Enter Address" icon={
      <IconGeo style={ { color: 'rgba(0, 0, 0, .75)' } } />
    } />
      { errors.address &&
      <FormFeedback>{ errors.address.message || 'Invalid address' }</FormFeedback> }
    </FormGroup>

    <FormGroup>
      <InputWithIcon type="time" tag={ props => (
        <input type="time" { ...props } required aria-required="true" { ...register('time', { required: true }) } />) } invalid={ !!(errors.time) } disabled={ isSubmitting } bsSize="lg" placeholder="Enter Time" icon={
        <IconClock style={ { color: 'rgba(0, 0, 0, .75)' } } /> } />
      { errors.time &&
      <FormFeedback>{ errors.time.message || 'Invalid time' }</FormFeedback> }
    </FormGroup>

    { errors.form &&
    <FormFeedback>{ errors.form.message || `Invalid data we couldn't understand` }</FormFeedback> }

    <FormGroup row>
      <Col className="text-right" sm={ { size: 10, offset: 2 } }>
        <RoundedButton type="submit" disabled={ isSubmitting } className="align-self-end" color="primary" size="lg" active>
          <If condition={ isSubmitting }><IconRefresh /></If><If condition={ !isSubmitting }><IconSearch /></If> Search now
        </RoundedButton>
      </Col>
    </FormGroup>

  </Form>;
};
