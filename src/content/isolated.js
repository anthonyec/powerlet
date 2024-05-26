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

const port = chrome.runtime.connect({ name: 'events' });

// Bridge all runtime events from the extension to window events.
port.onMessage.addListener(() => {
  console.log('port message');

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

  console.log('send message');

  if (message.type === identifiers.invokeProxyFunction) {
    invokeProxyFunction(message.name, message.args);
    return;
  }

  console.log(message);

  port.postMessage(message);
});
