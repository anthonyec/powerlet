chrome.runtime.onMessage.addListener((message) => {
  const event = new CustomEvent('powerlet-event', {
    detail: message
  });

  window.dispatchEvent(event);
});
