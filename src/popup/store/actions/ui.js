const EDITOR_WINDOW_WIDTH = 700;
const EDITOR_WINDOW_HEIGHT = 520;

export function navigateTo(url) {
  return (dispatch, getState, { browser }) => {
    browser.tabs.create({ url });
  };
}

export function openEditorWindow(id = '') {
  return (dispatch, getState, { browser }) => {
    return new Promise((resolve) => {
      browser.windows.create(
        {
          width: EDITOR_WINDOW_WIDTH,
          height: EDITOR_WINDOW_HEIGHT,
          url: `popup.html#editor/${id}`,
          type: 'popup',
          left: Math.floor(screen.availWidth / 2 - EDITOR_WINDOW_WIDTH / 2),
          top: Math.floor(screen.availHeight / 2 - EDITOR_WINDOW_HEIGHT / 2)
        },
        () => {
          resolve();
        }
      );
    });
  };
}
