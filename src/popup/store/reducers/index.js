import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import bookmarklets from './bookmarklets';
import ui from './ui';
import locale from './locale';
import options from './options';

const bookmarkletsPersistConfig = {
  key: 'bookmarklets',
  storage,
  whitelist: ['all', 'recent']
};

const optionsPersistConfig = {
  key: 'options',
  storage
};

export default combineReducers({
  bookmarklets: persistReducer(bookmarkletsPersistConfig, bookmarklets),
  options: persistReducer(optionsPersistConfig, options),
  ui,
  locale
});
