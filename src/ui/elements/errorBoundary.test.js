import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render, wait } from '@testing-library/react';
import { Provider } from 'react-redux';
import { history, store } from '../../app/store';
import { ConnectedRouter } from 'connected-react-router';
import { ErrorBoundary } from './errorBoundary';

describe(`src/ui/elements/errorBoundary.js`, () => {
  describe(`ErrorBoundary component`, () => {

    afterEach(cleanup);

    test('renders ErrorBoundary component', async () => {
      const ThrowingComponent = () => {
        return {};
      };

      const { getByText } = render(
        <Provider store={ store }>
          <ConnectedRouter history={ history }>
            <ErrorBoundary>
              <ThrowingComponent />
            </ErrorBoundary>
          </ConnectedRouter>
        </Provider>
      );

      await wait();

      expect(getByText(/Something went wrong/i)).toBeInTheDocument();
    });


  });

});
