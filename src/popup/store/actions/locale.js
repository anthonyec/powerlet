// TODO: Import reference to file instead of bundling JSON file into bundle.
import localeMessages from '../../../_locales/en/messages.json';

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
