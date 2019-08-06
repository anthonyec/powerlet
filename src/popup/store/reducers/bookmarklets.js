const SET_BOOKMARKLETS = 'SET_BOOKMARKLETS';

const defaultState = {
  all: []
};

export default function bookmarksReducer(state = defaultState, action) {
  console.log('bookmarksReducer->action', action);

  switch(action.type) {
    case SET_BOOKMARKLETS:
      return {
        // ...state,
        all: action.payload
      };
    default:
      console.log('default', state);
      return state;
  }
}
