export function navigateTo(url) {
  return (dispatch, getState, { browser }) => {
    browser.tabs.create({ url });
  };
}

export function openEditor() {
  return (dispatch, getState, { browser }) => {
    browser.windows.create({
      url: browser.runtime.getURL('popup.html#editor'),
      type: 'popup',
      width: 500,
      height: 532,
      top: 100,
      left: 100
    }, (win) => {
      // win represents the Window object from windows API
      // Do something after opening
    });
  };
}
