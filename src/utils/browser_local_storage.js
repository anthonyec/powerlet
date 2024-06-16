function removeNamespaceFromKey(namespace, namespacedKey) {
  return namespacedKey.replace(`${namespace}:`, '');
}

export function createBrowserLocalStorage(
  namespace = 'global',
  initialValues = {},
  onChange = (_values = {}) => {}
) {
  let values = { ...initialValues };

  const setValues = (newValues = {}) => {
    values = { ...values, ...newValues };
  };

  const handleStorageChange = (changes = {}) => {
    const namespacedKeys = Object.keys(changes);
    const newValues = {};

    for (const namespacedKey of namespacedKeys) {
      const key = removeNamespaceFromKey(namespace, namespacedKey);
      newValues[key] = changes[namespacedKey].newValue;
    }

    setValues({ ...values, ...newValues });
    onChange(values);
  };

  const getAll = async () => {
    const storedValues = await chrome.storage.local.get(null);

    const newValues = {};

    for (const [namespacedKey, value] of Object.entries(storedValues)) {
      const key = removeNamespaceFromKey(namespace, namespacedKey);

      const initialValue = typeof initialValues[key] !== 'undefined';
      if (!initialValue) continue;

      newValues[key] = value;
    }

    setValues({ ...values, ...newValues });
    onChange(values);

    return values;
  };

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

  const subscribe = () => {
    chrome.storage.local.onChanged.addListener(handleStorageChange);

    return () =>
      chrome.storage.local.onChanged.removeListener(handleStorageChange);
  };

  return { get, set, getAll, subscribe };
}
