import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import bookmarklets from './reducers/bookmarklets';

export default (preloadedState = {}, dependencies = {}) => {
  return createStore(
    combineReducers({
      bookmarklets
    }),
    {},
    applyMiddleware(thunk.withExtraArgument(dependencies))
  );
};
