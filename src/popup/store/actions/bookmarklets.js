import * as identifiers from '../../../identifiers';
import { isBookmarklet } from '../../../utils/is_bookmarklet';
import { createLogger } from '../../../utils/logger';

export const SET_BOOKMARKLETS = 'SET_BOOKMARKLETS';
export const ADD_RECENT_BOOKMARKLET = 'ADD_RECENT_BOOKMARKLET';
export const REMOVE_RECENT_BOOKMARKLET = 'REMOVE_RECENT_BOOKMARKLET';

const logger = createLogger('popup');

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

// TODO(anthony): Move this to a hook?
export function executeBookmarklet(id) {
  return async (dispatch) => {
    dispatch(addRecentBookmarklet(id));

    logger.log('execute');

    try {
      const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });
      if (!activeTab || !activeTab.id) return console.error('No active tab');

      // Send message to background worker.
      chrome.runtime.sendMessage({
        type: identifiers.executeBookmarkletEvent,
        bookmarkId: id,
        tabId: activeTab.id
      });
    } catch (err) {
      console.error(err);
    }
  };
}

// Clean up any recently used bookmarks that no longer exist.
export function removeNonExistentRecents() {
  return async (dispatch, getState, { browser }) => {
    const { bookmarklets } = getState();

    const getBookmarkPromises = bookmarklets.recent.map((id) => {
      return new Promise((resolve, reject) => {
        browser.bookmarks.get(id, (result) => {
          if (browser.runtime.lastError) {
            reject(id);
          }

          if (result) {
            resolve(id);
          }
        });
      });
    });

    const results = await Promise.allSettled(getBookmarkPromises);

    for (const result of results) {
      if (result.status === 'rejected' && result.reason) {
        dispatch(removeRecentBookmarklet(result.reason));
      }
    }
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
        const filteredResults = results.filter(isBookmarklet);

        dispatch(setBookmarklets(filteredResults));
      }
    );
  };
}
