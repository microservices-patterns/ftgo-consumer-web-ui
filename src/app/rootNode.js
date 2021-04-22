import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { history, store } from './store';
import { AppLayout } from '../ui/pages/AppLayout';
import './index.css';

const rootAppNode = <React.StrictMode>
  <Provider store={ store }>
    <ConnectedRouter history={ history }>
      <AppLayout />
    </ConnectedRouter>
  </Provider>
</React.StrictMode>;

export default rootAppNode;
