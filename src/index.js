import React from 'react';
import ReactDOM from 'react-dom';
//import App from './App';
import { history, store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { ConnectedRouter } from 'connected-react-router';
import { AppLayout } from './ui/pages/AppLayout';
import './index.css';


ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <ConnectedRouter history={ history }>
        <AppLayout />
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
export { Span } from './ui/elements/textElements';
