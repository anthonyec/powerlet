let keys = [];
let keyTimeout;

const ignoreKeys = [27, 9, 20, 16, 17, 18, 91, 93, 37, 40, 39, 38, 13, 8];

document.addEventListener('keydown', (evt) => {
  const code = evt.keyCode;
  const key = evt.key;
  const isSpecialKey = evt.key === 'Meta' || evt.key === 'Shift';
  const bothSpecialKeysPressed =
    keys.includes('Meta') && keys.includes('Shift');

  if (isSpecialKey && !bothSpecialKeysPressed) {
    keys.push(key);
  }

  if (!isSpecialKey && bothSpecialKeysPressed && !ignoreKeys.includes(code)) {
    keys.push(key);
  }

  clearTimeout(keyTimeout);

  keyTimeout = setTimeout(() => {
    keys = [];
  }, 300);
});

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  switch (message.type) {
    case 'GET_PRESSED_KEYS':
      reply({
        type: 'SET_PRESSED_KEYS',
        payload: keys
      });
      break;
    case 'CALLBACK_API_METHOD':
      const event = new CustomEvent('powerlet_method:' + message.payload.id, {
        detail: message.payload
      });

      document.dispatchEvent(event);

      break;

    case 'INJECT_BOOKMARKLET':
      const bookmarkletScript = document.createElement('script');

      bookmarkletScript.innerHTML = message.payload.code;

      document.body.appendChild(bookmarkletScript);
      document.body.removeChild(bookmarkletScript);

      break;
    default:
      break;
  }
});

const $script = document.createElement('script');

$script.innerHTML = `
  let calleeId = 0;

  const dispatchPowerleMethod = (namespace, method, ...args) => {
    calleeId += 1;

    return new Promise((resolve, reject) => {
      const event = new CustomEvent('powerlet_method', {
        detail: {
          id: calleeId,
          namespace,
          method,
          args
        }
      });

      document.dispatchEvent(event);

      const resolveCallback = (evt) => {
        resolve(...evt.detail.args);
        document.removeEventListener('powerlet_method:' + calleeId, resolveCallback);
      };

      document.addEventListener('powerlet_method:' + calleeId, resolveCallback);
    });
  };

  window.POWERLET_API = {
    tabs: {
      move: dispatchPowerleMethod.bind(null, 'tabs', 'move'),
      query: dispatchPowerleMethod.bind(null, 'tabs', 'query'),
      getCurrent: dispatchPowerleMethod.bind(null, 'tabs', 'getCurrent'),
      update: dispatchPowerleMethod.bind(null, 'tabs', 'update')
    }
  };
`;

document.body.appendChild($script);

document.addEventListener('powerlet_method', (evt) => {
  chrome.runtime.sendMessage({
    type: 'INVOKE_API_METHOD',
    payload: evt.detail
  })
}, false);
