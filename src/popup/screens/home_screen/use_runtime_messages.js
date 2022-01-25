import { useEffect, useState } from 'react';

export default function useRuntimeMessages() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender) => {
      console.log('message received', message, sender);
      setItems(message.args[0])
    });
  }, []);

  return items;
}
