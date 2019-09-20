import { SET_NEW_STARTER } from '../actions/user';

const defaultState = {
  isNewStarter: true
};

export default function userReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_NEW_STARTER:
      return Object.assign({}, state, {
        isNewStarter: action.payload
      });
    default:
      return state;
  }
}
