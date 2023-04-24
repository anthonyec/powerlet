import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef
} from 'react';

const UndoHistoryContext = createContext({
  push: () => {},
  pop: () => {},

  createHandle: (value) => {},
  removeHandle: (handle) => {},
  getHandleByValue: (value) => {}
});

/**
 * A reference that uses an ID that never changes but the value can change.
 */
class Handle {
  id = undefined;
  value = undefined;

  constructor(value) {
    this.id = Date.now();
    this.value = value;
  }

  update(value) {
    this.value = value;
  }
}

export function UndoHistoryProvider({ children }) {
  const [_stack, _setStack] = useState([]);
  const latestStack = useRef(_stack);
  const handles = useRef({});

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'KeyZ' && event.metaKey) {
        pop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [_stack]);

  const setStack = (newStack) => {
    _setStack(newStack);
    latestStack.current = newStack;
  };

  const push = (action) => {
    setStack([...latestStack.current, action]);
  };

  const pop = () => {
    if (latestStack.current.length === 0) {
      return;
    }

    const lastAction = latestStack.current[latestStack.current.length - 1];

    lastAction()
      .finally(() => {
        setStack(latestStack.current.slice(0, latestStack.current.length - 1));
      })
      .catch((error) => {
        console.error('Undo failed', error);
      });
  };

  const createHandle = (value) => {
    const handle = new Handle(value);

    handles.current[handle.id] = handle;

    return handle;
  };

  const removeHandle = (handle) => {
    if (handles.current[handle.id]) {
      delete handles.current[handle.id];
    }
  };

  const getHandleByValue = (value) => {
    return Object.values(handles.current).find((handle) => {
      return handle.value === value;
    });
  };

  return (
    <UndoHistoryContext.Provider
      value={{ push, pop, createHandle, removeHandle, getHandleByValue }}
    >
      {children}
    </UndoHistoryContext.Provider>
  );
}

export const useUndoHistory = () => useContext(UndoHistoryContext);
