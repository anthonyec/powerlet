console.log('Content loaded');

document.addEventListener('keydown', (evt) => {
  const key = evt.key;
  console.log(key);
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
