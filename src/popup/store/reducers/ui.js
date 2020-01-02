import { SET_PRESSED_KEYS, SET_COMMAND_KEYS } from '../actions/ui';

const defaultState = {
  keys: '',
  commands: []
};

export default function uiReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_PRESSED_KEYS:
      const filteredKeys = action.payload.filter((key) => {
        return key !== 'Meta' && key !== 'Shift';
      });

      return Object.assign({}, state, {
        keys: filteredKeys.join('')
      });
    case SET_COMMAND_KEYS:
      return Object.assign({}, state, {
        commands: action.payload
      });
    default:
      return state;
  }
}
