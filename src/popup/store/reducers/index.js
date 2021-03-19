import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import bookmarklets from './bookmarklets';
import ui from './ui';
import editor from './editor';
import locale from './locale';

const bookmarkletsPersistConfig = {
  key: 'bookmarklets',
  storage,
  whitelist: ['all']
};

export default combineReducers({
  bookmarklets: persistReducer(bookmarkletsPersistConfig, bookmarklets),
  ui,
  editor,
  locale
});
