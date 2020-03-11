import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

export default (preloadedState = {}, dependencies = {}) => {
  const store = createStore(
    reducers,
    {},
    applyMiddleware(thunk.withExtraArgument(dependencies))
  );

  return store;
};
