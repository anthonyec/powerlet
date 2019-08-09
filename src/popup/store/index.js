import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

export default (preloadedState = {}, dependencies = {}) => {
  return createStore(
    reducers,
    {},
    applyMiddleware(thunk.withExtraArgument(dependencies))
  );
};
