import * as identifiers from '../identifiers';
import { isObject } from '../utils/is_object';

// Bridge all runtime events from the extension to window events.
chrome.runtime.onMessage.addListener((message) => {
  const event = new CustomEvent(identifiers.contentMessageEvent, {
    detail: message
  });

  window.dispatchEvent(event);
});

window.addEventListener(identifiers.runtimeMessageEvent, (event) => {
  if (!isObject(event)) return;
  if (!('type' in event) || event.type !== identifiers.runtimeMessageEvent)
    return;
  if (!('type' in event.detail)) return;

  chrome.runtime.sendMessage(event.detail);
});
