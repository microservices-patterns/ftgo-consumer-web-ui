import React from 'react';
import { LandingPageForm } from './landingPageForm';
import { Container } from 'reactstrap';
import { LargeTextDiv, LessLargeTextDiv } from '../../elements/textElements';


const LandingPage = () => {

  return <Container>
    <div className="mb-5 mx-auto pt-3">
      <LargeTextDiv className="text-center">FTGO Application</LargeTextDiv>
      <LessLargeTextDiv className="text-center">Pick delivery address and time:</LessLargeTextDiv>
    </div>
    <div className="mx-auto">
      <LandingPageForm />
    </div>
  </Container>;
};

export default LandingPage;

