export const SET_PRESSED_KEYS = 'SET_PRESSED_KEYS';
export const SET_QUERY = 'SET_QUERY';
export const SET_SHORTCUTS = 'SET_SHORTCUTS';

export function navigateTo(url) {
  return (dispatch, getState, { browser }) => {
    browser.tabs.create({ url });
  };
}

export function setPressedKeys(keys) {
  return {
    type: SET_PRESSED_KEYS,
    payload: keys
  };
}

export function setShortcuts(shortcuts) {
  return {
    type: SET_SHORTCUTS,
    payload: shortcuts
  }
}

export function fetchPressedKeys() {
  return (dispatch, getState, { browser }) => {
    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      browser.tabs.sendMessage(
        tabs[0].id,
        {
          type: 'GET_PRESSED_KEYS'
        },
        (response) => {
          dispatch(setPressedKeys(response.payload));
        }
      );
    });
  };
}

export function fetchShortcuts() {
  return (dispatch, getState, { browser }) => {
    chrome.commands.getAll((shortcuts) => {
      dispatch(setShortcuts(shortcuts));
    });
  };
}
