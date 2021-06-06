export const SET_MESSAGES = 'SET_MESSAGES';

export function setMessages(messages = {}) {
  console.log('setMessages', messages);

  return {
    type: SET_MESSAGES,
    payload: messages
  };
}

export function fetchLocaleMessages() {
  return async (dispatch, getState, { browser }) => {
    // Used to get the locale message keys. It does not use this to get the
    // actual translations.
    // TODO: Is this fine? Duplicate data technically. Ideally I'd like to
    // reference `_locales/` that already exists in dist.
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
