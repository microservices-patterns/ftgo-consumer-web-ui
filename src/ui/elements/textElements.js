import styled from 'styled-components';

export const Span = styled.span`
  ${ props => props.vaMiddle ? `vertical-align: middle;` : '' }
  ${ props => props.centerEditIcon ? `transform: translate(2px, -2px); display: inline-block;` : '' }
`;
