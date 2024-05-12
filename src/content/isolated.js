const port = chrome.runtime.connect({ name: 'powerlet' });

port.onMessage.addListener((message) => {
  console.log('port->onMessage', message);

  const event = new CustomEvent('powerlet-event', {
    detail: message
  });

  window.dispatchEvent(event);
});

chrome.runtime.onMessage.addListener((message) => {
  console.log('runtime->onMessage', message);

  const event = new CustomEvent('powerlet-event', {
    detail: message
  });

  window.dispatchEvent(event);
});
