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

  chrome.runtime.sendMessage(message);
});
