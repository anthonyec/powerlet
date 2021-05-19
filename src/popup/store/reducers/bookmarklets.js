import { SET_BOOKMARKLETS, ADD_RECENT_BOOKMARKLET } from '../actions/bookmarklets';

const defaultState = {
  all: [],
  recent: []
};

export default function bookmarksReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_BOOKMARKLETS:
      return Object.assign({}, state, {
        all: action.payload
      });
    case ADD_RECENT_BOOKMARKLET:
      return {
        ...state,
        recent: [
          ...state.recent,
          action.payload
        ]
      }
    default:
      return state;
  }
}
