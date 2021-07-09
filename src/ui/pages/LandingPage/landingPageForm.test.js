import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render, wait } from '@testing-library/react';
import { Provider } from 'react-redux';
import { history, store } from '../../../app/store';
import { ConnectedRouter } from 'connected-react-router';
import { LandingPageForm } from './landingPageForm';

describe(`src/ui/pages/LandingPage/landingPageForm.js`, () => {

  describe(`LandingPageForm component`, () => {


    afterEach(cleanup);

    test('renders landing page form', async () => {
      const { getByText } = render(
        <Provider store={ store }>
          <ConnectedRouter history={ history }>
            <LandingPageForm />
          </ConnectedRouter>
        </Provider>
      );

      await wait();

      expect(getByText(/Search now/i)).toBeInTheDocument();
    });


  });

});
