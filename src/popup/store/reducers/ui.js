import { SET_PRESSED_KEYS } from '../actions/ui';

const defaultState = {
  keys: []
};

export default function uiReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_PRESSED_KEYS:
      const filteredKeys = action.payload.filter((key) => {
        return key !== 'Meta' && key !== 'Shift';
      });

      console.log(filteredKeys.join());

      return Object.assign({}, state, {
        keys: filteredKeys.join()
      });
    default:
      return state;
  }
}
