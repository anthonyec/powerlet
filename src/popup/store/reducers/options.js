import { SET_SHOW_ADD_BUTTON } from '../actions/options';

const defaultState = {
  showAddButton: true
};

export default function optionsReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_SHOW_ADD_BUTTON:
      return {
        ...state,
        showAddButton: action.payload
      };

    default:
      return state;
  }
}
