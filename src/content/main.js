import * as identifiers from '../identifiers';
import { isMessage } from '../utils/is_message';
import { createLogger } from '../utils/logger';

const logger = createLogger('content');

function isFunction(value) {
  return typeof value === 'function';
}

function sendMessage(message) {
  const event = new CustomEvent(identifiers.runtimeMessageEvent, {
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

function queueAndReload(id) {
  // TODO(anthony): POST MESSAGE
}

function executeBookmarklet(id, currentHash, retry = true) {
  const bookmarklet = getPowerletBookmarkletFunction(id);

  if (retry && !bookmarklet) {
    return queueAndReload(id);
  }

  const getHash = getPowerletHashFunction(id);
  const existingHash = getHash && getHash();
  const isHashDifferent = existingHash && existingHash !== currentHash;

  if (retry && isHashDifferent) {
    return queueAndReload(id);
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

  logger.log('onEvent', message);

  if (message.type === identifiers.executeBookmarkletEvent) {
    executeBookmarklet(message.bookmarkId, message.hash);
  }
});
