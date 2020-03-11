export const SET_CURRENT_FILE = 'SET_CURRENT_FILE';
export const UPDATE_CURRENT_FILE = 'UPDATE_CURRENT_FILE';
export const SET_LOADING = 'SET_LOADING';

function fileToBookmarklet(file = { title: '', code: '' }) {
  return {
    title: file.title,
    url: file.code
  };
}

function bookmarkletToFile(bookmarklet = { id: '', title: '', url: '' }) {
  return {
    id: bookmarklet.id,
    title: bookmarklet.title,
    code: bookmarklet.url
  };
}

function setCurrentFile(file = { id: '', title: '', code: '' }) {
  return {
    type: SET_CURRENT_FILE,
    payload: file
  };
}

export function updateCurrentFile(file = {}) {
  return {
    type: UPDATE_CURRENT_FILE,
    payload: file
  };
}

function setLoading(isLoading = false) {
  return {
    type: SET_LOADING,
    payload: isLoading
  };
}

export function fetchBookmarklet(id = '') {
  return (dispatch, getState, { browser }) => {
    dispatch(setLoading(true));

    browser.bookmarks.get(id, (results) => {
      if (!results.length) {
        return;
      }

      const file = bookmarkletToFile(results[0]);

      dispatch(setCurrentFile(file));
      dispatch(setLoading(false));
    });
  };
}

export function saveCurrentFile() {
  return (dispatch, getState, { browser }) => {
    const currentFile = getState().editor.currentFile;
    const { id } = currentFile;

    if (!id) {
      console.warn(`Not updating bookmark because current file id is ${id}`);
      return;
    }

    const newFile = fileToBookmarklet(currentFile);

    dispatch(setLoading(true));

    browser.bookmarks.update(id, newFile, (results) => {
      dispatch(setLoading(false));

      if (browser.runtime.lastError) {
        console.warn('Failed to save!', browser.runtime.lastError.message);
      }
    });
  };
}
