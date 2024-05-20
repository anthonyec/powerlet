// Bridge all runtime events from the extension to window events.
chrome.runtime.onMessage.addListener((message) => {
  const event = new CustomEvent('powerlet-event', {
    detail: message
  });

  window.dispatchEvent(event);
});
