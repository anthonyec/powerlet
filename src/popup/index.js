import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import createStats from 'simple-plausible-tracker';

import createStore from './store/index';
import App from './app';

const stats = createStats(process.env.STATS_DOMAIN, {
  onFireError: (err) => {
    console.error(err);
  }
});

const store = createStore(
  {},
  {
    browser: chrome,
    stats
  }
);

persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
