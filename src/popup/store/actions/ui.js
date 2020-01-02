import normalizeCommandShortcut from "../../utils/normalize_command_shortcut";

export const SET_PRESSED_KEYS = 'SET_PRESSED_KEYS';
export const SET_QUERY = 'SET_QUERY';
export const SET_COMMAND_KEYS = 'SET_COMMAND_KEYS';

export function navigateTo(url) {
  return (dispatch, getState, { browser }) => {
    browser.tabs.create({ url });
  };
}

export function setPressedKeys(keys) {
  return {
    type: SET_PRESSED_KEYS,
    payload: keys
  };
}

export function setCommandKeys(commands) {
  return {
    type: SET_COMMAND_KEYS,
    payload: commands
  }
}

export function fetchPressedKeys() {
  return (dispatch, getState, { browser }) => {
    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      browser.tabs.sendMessage(
        tabs[0].id,
        {
          type: 'GET_PRESSED_KEYS'
        },
        (response) => {
          dispatch(setPressedKeys(response.payload));
        }
      );
    });
  };
}

export function fetchCommandKeys() {
  return (dispatch, getState, { browser }) => {
    browser.commands.getAll(function(commands) {
      const normalizedCommands = commands.map((command) => {
        return Object.assign({}, command, {
          shortcut: normalizeCommandShortcut(command.shortcut)
        });
      });

      console.log(normalizedCommands);

      chrome.browserAction.setTitle({
        title: `Powerlets (${normalizedCommands[0].shortcut})`
      });

      dispatch(setCommandKeys(normalizedCommands));
    });
  };
}
