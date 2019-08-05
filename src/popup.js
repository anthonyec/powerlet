import React from 'react';
import ReactDOM from 'react-dom';

import createStore from './store/index';
import App from './app';

const store = createStore({}, {
  browser: chrome
});

ReactDOM.render(<App store={store} />, document.getElementById('root'));
