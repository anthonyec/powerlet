let keys = [];
let keyTimeout;

document.addEventListener('keydown', (evt) => {
  const key = evt.key;
  const isSpecialKey = evt.key === 'Meta' || evt.key === 'Shift';
  const bothSpecialKeysPressed = keys.includes('Meta') && keys.includes('Shift');

  if (isSpecialKey && !bothSpecialKeysPressed) {
    keys.push(key);
  }

  if (!isSpecialKey && bothSpecialKeysPressed) {
    keys.push(String.fromCharCode(evt.which));

    clearTimeout(keyTimeout);

    keyTimeout = setTimeout(() => {
      keys = [];
    }, 500);
  }

  console.log(keys);
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

const $links = document.querySelectorAll('a[href*="javascript:"]');

Array.from($links).forEach(($link) => {
  $link.addEventListener('click', (evt) => {
    evt.preventDefault();

    chrome.runtime.sendMessage({
      action: 'ADD_BOOKMARKLET',
      payload: {
        title: evt.currentTarget.innerText,
        url: evt.currentTarget.href
      }
    });
  });
});
