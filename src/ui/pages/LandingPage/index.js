import React from 'react';
import styled from 'styled-components';
import { LandingPageForm } from './landingPageForm';


const LargeTextDiv = styled.div`
  font-size: 4rem;
  font-weight: 800;
  color: rgba(0, 0, 0, .75);
`;

const LessLargeTextDiv = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: rgba(0, 0, 0, .8);
`;

const LandingPage = () => {

  return <div>
    <div className="mb-5 mx-auto pt-3">
      <LargeTextDiv className="text-center">FTGO Application</LargeTextDiv>
      <LessLargeTextDiv className="text-center">Pick delivery address and time:</LessLargeTextDiv>
    </div>
    <div className="mx-auto">
      <LandingPageForm />
    </div>
  </div>;
};

export default LandingPage;

