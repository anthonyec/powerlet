import React, { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';

import './reset.css';
import './app.css';
import { fetchAllBookmarks } from './store';

export default function App({ store }) {
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current.focus();

    store.dispatch(fetchAllBookmarks());
  });

  return (
    <Provider store={store}>
      <div className="app">
        <input ref={inputEl} />
      </div>
    </Provider>
  );
}
