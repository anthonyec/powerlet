const getKeyDownHandler = () => {
  let keys = [];
  let keyTimeout;

  return function handleKeyDown() {
    const key = evt.key;
    const isSpecialKey = evt.key === 'Meta' || evt.key === 'Shift';
    const bothSpecialKeysPressed =
      keys.includes('Meta') && keys.includes('Shift');

    if (isSpecialKey && !bothSpecialKeysPressed) {
      keys.push(key);
    }

    if (!isSpecialKey && bothSpecialKeysPressed) {
      keys.push(String.fromCharCode(evt.which));
    }

    clearTimeout(keyTimeout);

    keyTimeout = setTimeout(() => {
      keys = [];
    }, 1000);
  };
};

document.addEventListener('keydown', getKeyDownHandler());

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
