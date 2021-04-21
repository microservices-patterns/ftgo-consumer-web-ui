import ReactDOMServer from 'react-dom/server';
import React from 'react';
import styled from 'styled-components';
import { Button, Input } from 'reactstrap';

export const RoundedButton = styled(Button)`
  border-radius: 1rem;
`;
const RoundedInput = styled(Input)`
  border-radius: 1rem;
`;
const RoundedInputWithIcon = styled(RoundedInput)`
  padding-left: calc(1.5em + 0.75rem);
  background-repeat: no-repeat;
  background-position: left calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
`;

export function InputWithIcon({ icon, ...props }) {
  const iconMarkup = ReactDOMServer.renderToStaticMarkup(icon);

  if (!iconMarkup) {
    return <RoundedInput { ...props } />;
  }
  return <RoundedInputWithIcon { ...props } style={ {
    backgroundImage: `url('data:image/svg+xml;utf8,${ (iconMarkup) }')`,
    backgroundPosition: `left calc(0.375em + 0.1875rem) center`,
    paddingLeft: `calc(1.5em + 0.75rem)`,
    paddingRight: `0.75rem`
  } } />;
}
