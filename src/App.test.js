import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AppLayout from './ui/pages/AppLayout';

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={store}>
      <AppLayout />
    </Provider>
  );

  expect(getByText(/ftgo/i)).toBeInTheDocument();
});
