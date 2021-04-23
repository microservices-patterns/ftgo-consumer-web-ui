import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, fireEvent, render, waitForDomChange } from '@testing-library/react';
import { Provider } from 'react-redux';
import { history, store } from '../../../app/store';
import { ConnectedRouter } from 'connected-react-router';
import { Snippet } from './index';

describe(`src/ui/elements/Snippet/index.js`, () => {
  describe(`Snippet component`, () => {

    afterEach(cleanup);

    test('renders a Snippet component', async () => {
      const { getByText, getAllByText } = render(
        <Provider store={ store }>
          <ConnectedRouter history={ history }>
            <Snippet messageToCopy={ `lollapalooza` } />
          </ConnectedRouter>
        </Provider>
      );

      expect(getByText(/lollapalooza/i)).toBeInTheDocument();
      expect(getAllByText(/Copy/i)[ 0 ]).toBeInTheDocument();

      getAllByText(/Copy/i)[ 0 ].focus();
      fireEvent.click(getAllByText(/Copy/i)[ 0 ]);
      await waitForDomChange();

      expect(getByText(/Successfully copied/i)).toBeInTheDocument();

    });


  });

});
