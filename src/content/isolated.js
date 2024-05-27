import * as identifiers from '../identifiers';
import { isMessage } from '../utils/is_message';
import { createLogger } from '../utils/logger';

const logger = createLogger('content_isolated');

// Bridge all runtime events from the extension to window events.
chrome.runtime.onMessage.addListener((message) => {
  if (!isMessage(message)) return;

  logger.log('on_runtime_message', message);

  const event = new CustomEvent(identifiers.messageToContentScript, {
    detail: message
  });

  window.dispatchEvent(event);
});

window.addEventListener(identifiers.messageToIsolatedScript, (event) => {
  const message = event.detail;
  if (!isMessage(message)) return;

  logger.log('on_window_message', message);

  chrome.runtime.sendMessage(message);
});
