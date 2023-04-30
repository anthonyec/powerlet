import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import createStats from 'simple-plausible-tracker';

import createStore from './store/index';
import { ToastProvider } from './hooks/use_toast';
import { UndoHistoryProvider } from './hooks/use_undo_history';
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

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <ToastProvider>
      <UndoHistoryProvider>
        <App />
      </UndoHistoryProvider>
    </ToastProvider>
  </Provider>
);
