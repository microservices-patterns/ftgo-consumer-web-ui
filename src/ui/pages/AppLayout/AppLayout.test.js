import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, wait, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { history, store } from '../../../app/store';
import AppLayout from '../AppLayout';
import { ConnectedRouter } from 'connected-react-router';

describe(`src/ui/pages/AppLayout/AppLayout.test.js`, () => {

  afterEach(cleanup);

  test('renders ftgo application', async () => {
    const { getByText } = render(
      <Provider store={ store }>
        <ConnectedRouter history={ history }>
          <AppLayout />
        </ConnectedRouter>
      </Provider>
    );

    await wait();

    expect(getByText(/FTGO Application/i)).toBeInTheDocument();
  });


});
