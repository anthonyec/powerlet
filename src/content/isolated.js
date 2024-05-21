import { isObject } from '../utils/is_object';

// Bridge all runtime events from the extension to window events.
chrome.runtime.onMessage.addListener((message) => {
  console.log('_powerlet_content_message');

  const event = new CustomEvent('_powerlet_content_message', {
    detail: message
  });

  window.dispatchEvent(event);
});

window.addEventListener('_powerlet_runtime_message', (event) => {
  if (!isObject(event)) return;
  if (!('type' in event) || event.type !== '_powerlet_runtime_message') return;
  if (!('type' in event.detail)) return;

  chrome.runtime.sendMessage(event.detail);
});
