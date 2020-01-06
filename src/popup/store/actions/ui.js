export const SET_SHORTCUT_KEYS = 'SET_SHORTCUT_KEYS';

export function setShortcutKeys(shortcuts) {
  return {
    type: SET_SHORTCUT_KEYS,
    payload: shortcuts
  }
}

export function navigateTo(url) {
  return (dispatch, getState, { browser }) => {
    browser.tabs.create({ url });
  };
}

export function fetchShortcutKeys() {
  return (dispatch, getState, { browser }) => {
    browser.commands.getAll(function(shortcuts) {
      dispatch(setShortcutKeys(shortcuts));
    });
  };
}
