import { useEffect, useState } from 'react';

function removeNamespaceFromKey(namespace, namespacedKey) {
  return namespacedKey.replace(`${namespace}:`, '');
}

export function useBrowserLocalStorage(
  namespace = 'global',
  initialValues = {}
) {
  const [loaded, setLoaded] = useState(false);
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    const handleStorageChange = (changes = {}) => {
      const namespacedKeys = Object.keys(changes);
      const newValues = {};

      for (const namespacedKey of namespacedKeys) {
        const key = removeNamespaceFromKey(namespace, namespacedKey);
        newValues[key] = changes[namespacedKey].newValue;
      }

      setValues({ ...values, ...newValues });
    };

    const loadStoredValues = async () => {
      const storedValues = await chrome.storage.local.get(null);

      const newValues = {};

      for (const [namespacedKey, value] of Object.entries(storedValues)) {
        const key = removeNamespaceFromKey(namespace, namespacedKey);

        const initialValue = typeof initialValues[key] !== 'undefined';
        if (!initialValue) continue;

        newValues[key] = value;
      }

      setValues({ ...values, ...newValues });
      setLoaded(true);
    };

    chrome.storage.local.onChanged.addListener(handleStorageChange);
    loadStoredValues();

    return () => {
      chrome.storage.local.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const set = (key, value) => {
    if (!key) return;

    return chrome.storage.local.set({ [`${namespace}:${key}`]: value });
  };

  const get = async (key, defaultValue) => {
    if (!key) return;

    const result = await chrome.storage.local.get(`${namespace}:${key}`);

    const value = result[`${namespace}:${key}`] ?? defaultValue;
    setValues({ [key]: value });

    return value;
  };

  return { set, get, values, loaded };
}
