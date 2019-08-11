export const SET_PRESSED_KEYS = 'SET_PRESSED_KEYS';
export const SET_QUERY = 'SET_QUERY';

export function navigateTo(url) {
  return (dispatch, getState, { browser }) => {
    browser.tabs.create({ url });
  };
}

export function setPressedKeys(keys) {
  return {
    type: SET_PRESSED_KEYS,
    payload: keys
  }
}

export function fetchPressedKeys() {
  return (dispatch, getState, { browser }) => {
    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        type: 'GET_PRESSED_KEYS'
      }, (response) => {
        console.log('popup->response', response.payload);
        dispatch(setPressedKeys(response.payload));
      });
    });
  };
}
