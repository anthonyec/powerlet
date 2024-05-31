import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import createStats from 'simple-plausible-tracker';

import { supportsUserScripts } from '../utils/supports_user_scripts';
import App from './app';
import { ToastProvider } from './hooks/use_toast';
import { UndoHistoryProvider } from './hooks/use_undo_history';
import createStore from './store/index';

const statsDomain =
  process.env.NODE_ENV !== 'development' && process.env.STATS_DOMAIN;

const stats = statsDomain
  ? createStats(statsDomain, {
      onFireError: (err) => {
        console.error(err);
      }
    })
  : { fire: () => {} };

const store = createStore(
  {},
  {
    browser: chrome,
    stats
  }
);

persistStore(store);

if (!supportsUserScripts()) {
  window.location.hash = 'setup';
}

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
