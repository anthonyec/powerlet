import { SET_MESSAGES } from '../actions/locale';

const defaultState = {
  messages: {}
};

export default function localeReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_MESSAGES:
      return {
        ...state,
        messages: action.payload
      }
    default:
      return state;
  }
}
