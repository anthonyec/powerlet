const $search = document.querySelector('.js-search');

$search.focus();

chrome.runtime.sendMessage({
  msg: 'get_keys',
  data: {}
});

chrome.bookmarks.getChildren('65', (evt) => {
  console.log(evt);
});

chrome.bookmarks.getTree((evt) => {
  console.log(evt);
});
