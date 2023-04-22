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
  stack: [],

  createHandle: (value) => {},
  removeHandle: (handle) => {},
  getHandleByValue: (value) => {}
});

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
  const [stack, setStack] = useState([]);
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
  }, [stack]);

  const push = (action) => {
    setStack([...stack, action]);
  };

  const pop = async () => {
    if (stack.length === 0) {
      return;
    }

    const lastAction = stack[stack.length - 1];

    try {
      await lastAction();
    } catch (error) {
      console.error('Undo failed', error);
    }

    setStack(stack.slice(0, stack.length - 1));
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
      value={{ push, pop, stack, createHandle, removeHandle, getHandleByValue }}
    >
      {children}
    </UndoHistoryContext.Provider>
  );
}

export const useUndoHistory = () => useContext(UndoHistoryContext);
