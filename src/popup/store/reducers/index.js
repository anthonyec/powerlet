import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import bookmarklets from './bookmarklets';
import ui from './ui';
import locale from './locale';

const bookmarkletsPersistConfig = {
  key: 'bookmarklets',
  storage,
  whitelist: ['all', 'recent']
};

export default combineReducers({
  bookmarklets: persistReducer(bookmarkletsPersistConfig, bookmarklets),
  ui,
  locale
});
