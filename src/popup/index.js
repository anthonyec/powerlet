import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';

import createStore from './store/index';
import HomeScreen from './screens/home_screen';

const store = createStore(
  {},
  {
    browser: chrome
  }
);

persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <HomeScreen />
  </Provider>,
  document.getElementById('root')
);
