export const SET_BOOKMARKLETS = 'SET_BOOKMARKLETS';
export const ADD_RECENT_BOOKMARKLET = 'ADD_RECENT_BOOKMARKLET';

function setBookmarklets(bookmarklets = []) {
  return {
    type: SET_BOOKMARKLETS,
    payload: bookmarklets
  };
}

function addRecentBookmarklet(id) {
  return {
    type: ADD_RECENT_BOOKMARKLET,
    payload: id
  }
}

export function executeBookmarklet(id, url) {
  return (dispatch, getState, { browser }) => {
    let bookmarkletCode;

    try {
      bookmarkletCode = decodeURIComponent(url);
    } catch (err) {
      bookmarkletCode = url;
    }

    const code = `
      try {
        ${bookmarkletCode}
      } catch(err) {
        console.error(err);
        alert('Bookmarklet error: ' + err.message);
      }
    `;

    dispatch(addRecentBookmarklet(id));
    browser.tabs.executeScript({ code, runAt: 'document_start' });
  };
}

export function fetchAllBookmarklets() {
  return (dispatch, getState, { browser }) => {
    browser.bookmarks.search(
      {
        // Use query because it's fuzzy, searching by URL only returns
        // exact macthes.
        query: 'javascript:'
      },
      (results) => {
        const filteredResults = results.filter((result) => {
          return result.url && result.url.match(/^javascript\:/);
        });

        dispatch(setBookmarklets(filteredResults));
      }
    );
  };
}
