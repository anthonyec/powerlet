import * as identifiers from '../identifiers';
import { isMessage } from '../utils/is_message';
import { createLogger } from '../utils/logger';

const logger = createLogger('content');

function isFunction(value) {
  return typeof value === 'function';
}

function sendMessage(message) {
  const event = new CustomEvent(identifiers.messageToIsolatedScript, {
    detail: message
  });

  window.dispatchEvent(event);
}

function getPowerletFunction(name, id) {
  const powerletFunction = window[`_powerlet_${name}_${id}`];
  if (!isFunction(powerletFunction)) return null;

  return powerletFunction;
}

function getPowerletBookmarkletFunction(id) {
  return getPowerletFunction('bookmarklet', id);
}

function getPowerletHashFunction(id) {
  return getPowerletFunction('get_hash', id);
}

function queueAndReload(bookmarkId, tabId) {
  // TODO(anthony): There is a glitch where it will execute the bookmarklet
  // twice on reload.
  sendMessage({ type: identifiers.queueAndReloadEvent, bookmarkId, tabId });
}

function executeBookmarklet(bookmarkId, tabId, currentHash, retry = true) {
  const bookmarklet = getPowerletBookmarkletFunction(bookmarkId);

  if (retry && !bookmarklet) {
    logger.error(`Could not find bookmarklet: ${bookmarkId}`);
    return queueAndReload(bookmarkId);
  }

  const getHash = getPowerletHashFunction(bookmarkId);
  const existingHash = getHash && getHash();
  const isHashDifferent = existingHash && existingHash !== currentHash;

  if (retry && isHashDifferent) {
    logger.error('Hash is different, reloading and retrying');
    return queueAndReload(bookmarkId, tabId);
  }

  try {
    bookmarklet();
  } catch (err) {
    alert(`Failed to run bookmarklet:\n${err}`);
  }
}

window[identifiers.invokeProxyFunction] = (name, args = []) => {
  sendMessage({ type: identifiers.invokeProxyFunction, name, args });
};

window.addEventListener(identifiers.messageToContentScript, (event) => {
  const message = event.detail;
  if (!isMessage(message)) return;

  logger.log('window_message', message);

  if (message.type === identifiers.executeBookmarkletEvent) {
    executeBookmarklet(
      message.bookmarkId,
      message.tabId,
      message.hash,
      message.retry
    );
  }
});
