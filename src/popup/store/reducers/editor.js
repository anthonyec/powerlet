import { SET_CURRENT_FILE } from '../actions/editor';

const defaultState = {
  currentFile: {
    title: '',
    code: ''
  }
};

export default function editorReducer(state = defaultState, action) {
  if (action.type === SET_CURRENT_FILE) {
    return {
      ...state,
      currentFile: action.payload
    };
  }

  return state;
}
