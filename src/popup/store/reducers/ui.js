import {
  SET_PRESSED_KEYS,
  SET_SHORTCUTS
} from '../actions/ui';

const defaultState = {
  keys: '',
  shortcuts: []
};

export default function uiReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_SHORTCUTS:
      return Object.assign({}, state, {
        shortcuts: action.payload
      });
    case SET_PRESSED_KEYS:
      const filteredKeys = action.payload.filter((key) => {
        return key !== 'Meta' && key !== 'Shift';
      });

      return Object.assign({}, state, {
        keys: filteredKeys.join('')
      });
    default:
      return state;
  }
}
