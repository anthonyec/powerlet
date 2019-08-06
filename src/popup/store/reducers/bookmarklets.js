const SET_BOOKMARKLETS = 'SET_BOOKMARKLETS';

const defaultState = {
  all: []
};

export default function bookmarksReducer(state = defaultState, action) {
  switch(action.type) {
    case SET_BOOKMARKLETS:
      return {
        // ...state,
        all: action.payload
      };
    default:
      return state;
  }
}
