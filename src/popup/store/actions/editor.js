export const SET_CURRENT_FILE = 'SET_CURRENT_FILE';

function setCurrentFile(file = {}) {
  return {
    type: SET_CURRENT_FILE,
    payload: file
  };
}

export function fetchBookmarklet(id = '') {
  return (dispatch, getState, { browser }) => {
    browser.bookmarks.get(id,
      (results) => {
        if (!results.length) {
          return;
        }

        const file = {
          title: results[0].title,
          code: decodeURIComponent(results[0].url)
        };

        dispatch(setCurrentFile(file));
      }
    );
  };
}
