const api = {
  tabs: {
    getCurrent: ([], sender, id) => {
      chrome.tabs.get(sender.tab.id, (...args) => {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: 'CALLBACK_API_METHOD',
          payload: {
            id,
            args
          }
        });
      });
    },
    update: ([tabId, updateProperties], sender) => {
      chrome.tabs.update(null, updateProperties, (...args) => {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: 'CALLBACK_API_METHOD',
          payload: {
            args
          }
        });
      })
    }
  }
};

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  switch (message.type) {
    case 'INVOKE_API_METHOD':
      console.log('background->INVOKE_API_METHOD!', message.payload);
      const { id, namespace, method, args } = message.payload;

      api[namespace][method](args, sender, id);

      break;
    default:
      break;
  }
});
