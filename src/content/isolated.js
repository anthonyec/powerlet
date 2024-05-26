import * as identifiers from '../identifiers';
import { isMessage } from '../utils/is_message';
import { createLogger } from '../utils/logger';

const logger = createLogger('isolated');

function invokeProxyFunction(name, args = []) {
  switch (name) {
    case 'open': {
      window.open(...args);
      break;
    }

    default: {
      logger.error(`No proxy function found for: ${name}`);
    }
  }
}

// Bridge all runtime events from the extension to window events.
chrome.runtime.onMessage.addListener((message) => {
  if (!isMessage(message)) return;

  logger.log('runtime_message', message);

  const event = new CustomEvent(identifiers.messageToContentScript, {
    detail: message
  });

  window.dispatchEvent(event);
});

window.addEventListener(identifiers.messageToIsolatedScript, (event) => {
  const message = event.detail;
  if (!isMessage(message)) return;

  logger.log('window_message', message);

  if (message.type === identifiers.invokeProxyFunction) {
    // Catch invoke proxy function events here to preventing them from ending up
    // in the the background worker. This is because we have access to
    // `window.open` in isolated content, and can open up windows without Chrome
    // popup blocker stopping them. Popup windows are blocked in the main
    // content script.
    invokeProxyFunction(message.name, message.args);
    return;
  }

  chrome.runtime.sendMessage(message);
});
