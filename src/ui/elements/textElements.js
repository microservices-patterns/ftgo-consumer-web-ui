import styled from 'styled-components';

export const Span = styled.span`
  ${ props => props.vaMiddle ? `vertical-align: middle;` : '' }
  ${ props => props.centerEditIcon ? `transform: translate(2px, -2px); display: inline-block;` : '' }
`;

export const LargeTextDiv = styled.div`
  font-size: 4rem;
  font-weight: 800;
  color: rgba(0, 0, 0, .75);
`;

export const LessLargeTextDiv = styled.div`
  font-size: ${ props => props.size || 3 }rem;
  font-weight: 800;
  color: rgba(0, 0, 0, .8);
`;
