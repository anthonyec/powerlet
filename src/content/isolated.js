import * as identifiers from '../identifiers';
import { isObject } from '../utils/is_object';

function invokeProxyFunction(name, args = []) {
  switch (name) {
    case 'open': {
      window.open(...args);
      break;
    }

    default: {
      console.error(`No proxy function found for: ${name}`);
    }
  }
}

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

  const message = event.detail;

  if (message.type === identifiers.invokeProxyFunction) {
    invokeProxyFunction(message.name, message.args);
    return;
  }

  chrome.runtime.sendMessage(message);
});
