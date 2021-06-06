export const SET_MESSAGES = 'SET_MESSAGES';

export function setMessages(messages = {}) {
  return {
    type: SET_MESSAGES,
    payload: messages
  };
}

export function fetchLocaleMessages() {
  return async (dispatch, getState, { browser }) => {
    // Dynamic import is used to get the locale message **keys** and
    // not the actual translation strings.
    // TODO: Is this fine? Data is duplicated, ideally I'd like to reference
    // `_locales/` that already exists in dist. Look into how to do this with
    // Wwebpack 5: https://webpack.js.org/guides/asset-modules/
    const localeMessages = await import('../../../_locales/en/messages.json');

    const messages = Object.keys(localeMessages).reduce(
      (reducedMessages, localeMessageKey) => {
        reducedMessages[localeMessageKey] = browser.i18n.getMessage(
          localeMessageKey
        );
        return reducedMessages;
      },
      {}
    );

    dispatch(setMessages(messages));
  };
}
