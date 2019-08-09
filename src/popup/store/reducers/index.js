import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import bookmarklets from './bookmarklets';

const bookmarkletsPersistConfig = {
  key: 'bookmarklets',
  storage,
  whitelist: ['all']
};

export default combineReducers({
  bookmarklets: persistReducer(bookmarkletsPersistConfig, bookmarklets)
});
