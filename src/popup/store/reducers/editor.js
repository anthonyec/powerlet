import { SET_CURRENT_FILE, SET_LOADING } from '../actions/editor';

const defaultState = {
  isLoading: false,
  currentFile: {
    id: '',
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

  if (action.type === SET_LOADING) {
    return {
      ...state,
      isLoading: action.payload
    };
  }

  return state;
}
