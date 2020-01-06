import { SET_SHORTCUT_KEYS } from '../actions/ui';

const defaultState = {
  shortcuts: []
};

export default function uiReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_SHORTCUT_KEYS:
      return Object.assign({}, state, {
        shortcuts: action.payload
      });

    default:
      return state;
  }
}
