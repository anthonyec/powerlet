import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';

import createStore from './store/index';
import App from './app';

import './reset.css';

const store = createStore(
  {},
  {
    browser: chrome
  }
);

persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
