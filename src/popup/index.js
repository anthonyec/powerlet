import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import createStats from 'simple-plausible-tracker';

import createStore from './store/index';
import { ToastProvider } from './hooks/useToast';
import { UndoHistoryProvider } from './hooks/useUndoHistory';
import App from './app';

const statsDomain =
  process.env.NODE_ENV !== 'development' && process.env.STATS_DOMAIN;
const stats = createStats(statsDomain, {
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
    <ToastProvider>
      <UndoHistoryProvider>
        <App />
      </UndoHistoryProvider>
    </ToastProvider>
  </Provider>,
  document.getElementById('root')
);
