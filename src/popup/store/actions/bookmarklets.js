function setBookmarklets(bookmarklets = []) {
  return {
    type: 'SET_BOOKMARKLETS',
    payload: bookmarklets
  }
}

export function executeBookmarklet(url) {
  return (dispatch, getState, { browser }) => {
    let bookmarkletCode;

    try {
      bookmarkletCode = decodeURIComponent(url)
    } catch(err) {
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

    browser.tabs.executeScript({ code, runAt: 'document_start' });
  }
}

export function fetchAllBookmarklets() {
  return (dispatch, getState, { browser }) => {
    browser.bookmarks.search({
      query: 'javascript:'
    }, (results) => {
      const filteredResults = results.filter((result) => {
        return result.url.match(/^javascript\:/);
      });

      dispatch(setBookmarklets(filteredResults));
    });
  }
}
