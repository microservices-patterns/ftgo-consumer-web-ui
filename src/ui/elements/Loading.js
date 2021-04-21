import styled from 'styled-components';
import React from 'react';
import cx from 'classnames';
import { IconRefresh } from './icons';

export const Loading = styled.div`
  min-height: 80vh;
  text-align: center;
  vertical-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  border-radius: 2rem;
  font-size: 1.5rem;
`;

export const LoadingSpinner = ({ inline }) =>
  <div className={ cx('text-black-50', inline ? 'd-inline-block' : '') }>
    <IconRefresh />
  </div>;
