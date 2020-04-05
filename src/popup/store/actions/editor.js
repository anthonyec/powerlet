import { openEditorWindow } from './ui';

export const SET_CURRENT_FILE = 'SET_CURRENT_FILE';
export const UPDATE_CURRENT_FILE = 'UPDATE_CURRENT_FILE';
export const SET_LOADING = 'SET_LOADING';
export const SET_FOLDERS = 'SET_FOLDERS';

function fileToBookmarklet(file = { title: '', code: '' }) {
  return {
    title: file.title,
    url: file.code
  };
}

function bookmarkletToFile(
  bookmarklet = { id: '', title: '', url: '', parentId: '' }
) {
  return {
    id: bookmarklet.id,
    title: bookmarklet.title,
    code: bookmarklet.url,
    parentId: bookmarklet.parentId
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

function setFolders(folders = []) {
  return {
    type: SET_FOLDERS,
    payload: folders
  };
}

export function fetchBookmarklet(id = '') {
  return (dispatch, getState, { browser }) => {
    dispatch(setLoading(true));

    browser.bookmarks.get(id, (results) => {
      dispatch(setLoading(false));

      if (browser.runtime.lastError) {
        console.warn('Failed to fetch!', browser.runtime.lastError.message);
        return;
      }

      if (!results || !results.length) {
        console.warn('No bookmarklet found for id', id);
        return;
      }

      const file = bookmarkletToFile(results[0]);

      dispatch(setCurrentFile(file));
    });
  };
}

export function createNewBookmarklet() {
  return (dispatch, getState, { browser }) => {
    browser.bookmarks.create(
      {
        title: 'New script',
        url:
          'javascript: (function() { alert("This is your new script!"); } )();'
      },
      (bookmark) => {
        if (browser.runtime.lastError) {
          console.warn(
            'Failed to create new bookmark!',
            browser.runtime.lastError.message
          );
          return;
        }

        dispatch(openEditorWindow(bookmark.id));
      }
    );
  };
}

export function deleteBookmarklet(id = '') {
  return (dispatch, getState, { browser }) => {
    if (!id) {
      console.warn(`Not deleting bookmark because current file id is "${id}"`);
      return;
    }

    browser.bookmarks.remove(id, () => {
      if (browser.runtime.lastError) {
        console.warn('Failed to delete!', browser.runtime.lastError.message);
        return;
      }
    });
  };
}

export function changeBookmarkletFolder(id = '', parentId = '') {
  return (dispatch, getState, { browser }) => {
    if (!id) {
      console.warn(`Not moving bookmark because current file id is "${id}"`);
      return;
    }

    if (!parentId) {
      console.warn(`"parentId" required!`);
      return;
    }

    browser.bookmarks.move(id, { parentId }, () => {
      if (browser.runtime.lastError) {
        console.warn('Failed to move!', browser.runtime.lastError.message);
        return;
      }

      dispatch(updateCurrentFile({ parentId }));
    });
  };
}

function recurse(results, level) {
  let children = [];

  results.forEach((result) => {
    if (result.children) {
      children.push({
        level: level,
        id: result.id,
        title: result.title
      });

      children = [...children, ...recurse(result.children, level + 1)];
    }
  });

  return children;
}

export function fetchAllFolders() {
  return (dispatch, getState, { browser }) => {
    browser.bookmarks.getTree((results) => {
      const folders = recurse(results, 0);

      dispatch(setFolders(folders));
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
