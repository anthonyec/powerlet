import * as identifiers from '../identifiers';
import { isObject } from '../utils/is_object';

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
  // sendMessage({
  //   type: identifiers.queueAndReloadEvent,
  //   id
  // });
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
    alert('Failed to run bookmarklet:\n', err);
  }
}

function handleMessage(message) {
  if (message.type === identifiers.executeBookmarkletEvent) {
    executeBookmarklet(message.id, message.hash);
  }
}

window[identifiers.invokeProxyFunction] = (name, args = []) => {
  sendMessage({ type: identifiers.invokeProxyFunction, name, args });
};

window.addEventListener(identifiers.contentMessageEvent, (event) => {
  if (!isObject(event)) return;
  if (!('type' in event) || event.type !== identifiers.contentMessageEvent)
    return;
  if (!('type' in event.detail)) return;

  handleMessage(event.detail);
});
