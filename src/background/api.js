const api = {
  tabs: {
    move: ([tabIds, moveProperties], sender, id) => {
      chrome.tabs.move(tabIds, moveProperties, (...args) => {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: 'CALLBACK_API_METHOD',
          payload: {
            id,
            args
          }
        });
      });
    },
    query: ([queryInfo], sender, id) => {
      chrome.tabs.query(queryInfo, (...args) => {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: 'CALLBACK_API_METHOD',
          payload: {
            id,
            args
          }
        });
      });
    },
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
