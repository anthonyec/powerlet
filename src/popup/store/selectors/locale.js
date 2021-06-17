import { createSelector } from 'reselect';

const selectLocaleMessages = (state) => state.locale.messages;

export const selectTranslations = createSelector(
  selectLocaleMessages,
  (messages) => {
    return messages;
  }
);
