export function navigateTo(url) {
  return (dispatch, getState, { browser }) => {
    browser.tabs.create({ url });
  };
}

export function openEditorWindow(id = '') {
  return (dispatch, getState, { browser }) => {
    browser.windows.create({
      width: 500,
      height: 450,
      url: `popup.html#editor/${id}`,
      type: 'popup',
      top: 100,
      left: 100
    });
  };
}
