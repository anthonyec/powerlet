import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const UndoHistoryContext = createContext({
  push: () => {},
  pop: () => {},
  stack: [],
});

export function UndoHistoryProvider({ children }) {
  const [stack, setStack] = useState([]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "KeyZ" && event.metaKey) {
        pop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [stack])

  const push = (action) => {
    setStack([
      ...stack,
      action
    ]);
  };

  const pop = () => {
    if (stack.length === 0) {
      return;
    }

    const lastAction = stack[stack.length - 1];

    try {
      lastAction();
    } catch(error) {
      console.error("Undo failed", error);
    }

    setStack(stack.slice(0, stack.length - 1));
  };

  return (
    <UndoHistoryContext.Provider value={{ push, pop, stack }}>
      {children}
    </UndoHistoryContext.Provider>
  );
}

export const useUndoHistory = () => useContext(UndoHistoryContext);
