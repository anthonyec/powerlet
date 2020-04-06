
console.log("LOADED");

chrome.runtime.onMessage.addListener((message) => {
  console.log('Received message!', message);
});


chrome.runtime.onMessageExternal.addListener((message) => {
  console.log('onMessageExternal', message);
});

chrome.bookmarks.create({
  'title': 'Test',
  'url': 'javascript: alert(0)'
});
