import { useEffect, useRef, useState } from 'react';
import { createBrowserLocalStorage } from '../../utils/browser_local_storage';

export function useBrowserLocalStorage(
  namespace = 'global',
  initialValues = {}
) {
  const [loaded, setLoaded] = useState(false);
  const [values, setValues] = useState(initialValues);

  const storage = useRef(
    createBrowserLocalStorage(namespace, initialValues, (changes) =>
      setValues(changes)
    )
  );

  useEffect(() => {
    storage.current.getAll().then(() => setLoaded(true));
    return storage.current.subscribe();
  }, []);

  return { set: storage.current.set, get: storage.current.get, values, loaded };
}
