import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import deepFilter from 'deep-filter';

export function fetchAllBookmarks() {
  return (dispatch, getState, { browser }) => {
    browser.bookmarks.getTree((tree) => {
    //   const filtered = deepFilter(tree, (value, prop, subject) => {

    //     return subject[prop] && subject[prop].children;
    //   });

    //   console.log(filtered);
    });
  }
}

function setBookmarks() {

}

function reducer(state = {}, action) {
  switch(state) {
    default:
      return state;
  }
}

export default (preloadedState = {}, dependencies = {}) => {
  return createStore(
    reducer,
    {},
    applyMiddleware(thunk.withExtraArgument(dependencies))
  );
}
