import { SET_BOOKMARKLETS } from '../actions/bookmarklets';

const defaultState = {
  all: []
};

export default function bookmarksReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_BOOKMARKLETS:
      return Object.assign({}, state, {
        all: action.payload
      });
    default:
      return state;
  }
}
