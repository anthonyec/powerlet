import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import bookmarklets from './bookmarklets';
import ui from './ui';
import user from './user';

const bookmarkletsPersistConfig = {
  key: 'bookmarklets',
  storage,
  whitelist: ['all']
};

const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['seenMessages']
};

export default combineReducers({
  bookmarklets: persistReducer(bookmarkletsPersistConfig, bookmarklets),
  user: persistReducer(userPersistConfig, user),
  ui
});
