import {
  SET_CURRENT_FILE,
  SET_LOADING,
  UPDATE_CURRENT_FILE,
  SET_FOLDERS
} from '../actions/editor';

const defaultState = {
  isLoading: false,
  currentFile: {
    id: '',
    title: '',
    code: '',
    parentId: ''
  },
  folders: []
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

  if (action.type === SET_FOLDERS) {
    return {
      ...state,
      folders: action.payload
    };
  }

  if (action.type === UPDATE_CURRENT_FILE) {
    const mergedFileWithUpdates = {
      ...state.currentFile,
      ...action.payload,

      // Ensure ID is not overwritten.
      id: state.currentFile.id
    };

    return {
      ...state,
      currentFile: mergedFileWithUpdates
    };
  }

  return state;
}
