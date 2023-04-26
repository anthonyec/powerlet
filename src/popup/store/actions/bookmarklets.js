export const SET_BOOKMARKLETS = 'SET_BOOKMARKLETS';
export const ADD_RECENT_BOOKMARKLET = 'ADD_RECENT_BOOKMARKLET';
export const REMOVE_RECENT_BOOKMARKLET = 'REMOVE_RECENT_BOOKMARKLET';

function setBookmarklets(bookmarklets = []) {
  return {
    type: SET_BOOKMARKLETS,
    payload: bookmarklets
  };
}

export function removeRecentBookmarklet(id) {
  return {
    type: REMOVE_RECENT_BOOKMARKLET,
    payload: id
  };
}

export function addRecentBookmarklet(id) {
  return {
    type: ADD_RECENT_BOOKMARKLET,
    payload: id
  };
}

export function executeBookmarklet(id, url) {
  return async (dispatch, getState, { browser }) => {
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
    await browser.tabs.executeScript({ code, runAt: 'document_start' });
  };
}

export function fetchAllBookmarklets() {
  return (dispatch, getState, { browser }) => {
    browser.bookmarks.search(
      {
        // Use query because it's a fuzzy search. Searching by URL would
        // only return exact matches.
        query: 'javascript:'
      },
      (results) => {
        // Remove any matches that had "javascript:" in the URL but not
        // at the very start, which makes them not bookmarklets.
        const filteredResults = results.filter((result) => {
          return result.url && result.url.match(/^javascript\:/);
        });

        dispatch(setBookmarklets(filteredResults));
      }
    );
  };
}
