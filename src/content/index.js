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
  }, 500);
});

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  switch (message.type) {
    case 'GET_PRESSED_KEYS':
      reply({
        type: 'SET_PRESSED_KEYS',
        payload: keys
      });
      break;
    default:
      break;
  }
});
