import React from 'react';
import { css } from '@emotion/primitives';
import { Button, Col, Form, FormGroup, Input } from 'reactstrap';
import { IconClock, IconGeo, IconSearch } from '../../elements/icons';
import ReactDOMServer from 'react-dom/server';

const LandingPage = () => {
  return <div>
    <div className="mb-5 mx-auto">
      <div className="text-center" style={ css`font-size: 4rem;
        font-weight: 800;
        color: rgba(0, 0, 0, .75);` }>FTGO Application
      </div>
      <div className="text-center" style={ css`font-size: 3rem;
        font-weight: 800;
        color: rgba(0, 0, 0, .8);` }>Pick delivery address and time:
      </div>
    </div>
    <div className="mx-auto">
      <Form className="col-md-6 offset-md-3">
        <FormGroup>
          <InputWithIcon type="text" bsSize="lg" placeholder="Enter Address" icon={
            <IconGeo style={ { color: 'rgba(0, 0, 0, .75)' } } /> } />
        </FormGroup>
        <FormGroup>
          <InputWithIcon type="text" bsSize="lg" placeholder="Enter Time" icon={
            <IconClock style={ { color: 'rgba(0, 0, 0, .75)' } } /> } />
        </FormGroup>

        <FormGroup row>
          <Col className="text-right" sm={ { size: 10, offset: 2 } }>
            <Button className="align-self-end" color="primary" size="lg" active style={ css`
border-radius: 1rem;            
`}> <IconSearch /> Search now </Button>
          </Col>
        </FormGroup>

      </Form>
    </div>
  </div>;
};

export default LandingPage;

function InputWithIcon({ icon, ...props }) {
  const iconMarkup = ReactDOMServer.renderToStaticMarkup(icon);
  const style = Object.assign({
    backgroundImage: `url('data:image/svg+xml;utf8,${ (iconMarkup) }')`
  }, css`
    padding-left: calc(1.5em + 0.75rem);
    background-repeat: no-repeat;
    background-position: left calc(0.375em + 0.1875rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  `);
  return <Input { ...props } style={ iconMarkup ? style : {} } />;
}
