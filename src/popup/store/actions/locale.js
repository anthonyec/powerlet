export const SET_MESSAGES = 'SET_MESSAGES';

// TODO: Is there a way to get these from `messages.json` without duplicating them?
const messageNames = [
  'search_scripts_placeholder',
  'empty_state_message',
  'empty_state_button',
  'create_new_script_button',
  'edit_script_button',
  'share_script_button',
  'delete_script_button',
  'done_button',
  'cancel_button',
  'feedback_button',
  'settings_button',
  'edit_script_title',
  'autorun_label',
  'share_page_save_label',
  'share_page_drag_label',
  'delete_script_confirmation_message',
  'delete_button',
  'name_label'
];

export function setMessages(messages = {}) {
  return {
    type: SET_MESSAGES,
    payload: messages
  };
}

export function fetchLocaleMessages() {
  return async (dispatch, getState, { browser }) => {
    const messages = messageNames.reduce((mem, messageName) => {
      mem[messageName] = browser.i18n.getMessage(messageName);
      return mem;
    }, {});

    dispatch(setMessages(messages));
  };
}
