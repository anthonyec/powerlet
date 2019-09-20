import { SET_MESSAGE_AS_SEEN } from '../actions/user';

const defaultState = {
  seenMessages: []
};

export default function userReducer(state = defaultState, action) {
  if (action.type === SET_MESSAGE_AS_SEEN) {
    if (!state.seenMessages.includes(action.payload)) {
      return {
        ...state,
        seenMessages: [...state.seenMessages, action.payload]
      };
    }

    return state;
  }

  return state;
}
