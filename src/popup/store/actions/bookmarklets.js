function setBookmarklets(bookmarklets = []) {
  console.log('setBookmarklets', bookmarklets);
  return {
    type: 'SET_BOOKMARKLETS',
    payload: bookmarklets
  }
}

export function executeBookmarklet(url) {
  return (dispatch, getState, { browser }) => {
    browser.tabs.executeScript({ code: url });
  }
}

export function fetchAllBookmarklets() {
  console.log('fetchAllBookmarklets');

  return (dispatch, getState, { browser }) => {
    browser.bookmarks.search({
      query: 'javascript:'
    }, (results) => {
      const filteredResults = results.filter((result) => {
        return result.url.match(/^javascript\:/);
      });

      console.log('fetchAllBookmarklets->setBookmarklets', filteredResults)
      dispatch(setBookmarklets(filteredResults));
    });
  }
}
