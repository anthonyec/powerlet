import React, { createContext, useContext, useState } from 'react';

const UndoHistoryContext = createContext({
  push: () => {},
  pop: () => {},
  stack: [],
});

export function UndoHistoryProvider({ children }) {
  const [stack, setStack] = useState([]);

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

    setStack([
      ...stack.slice(stack.length - 1, stack.length - 2)
    ]);
  };

  return (
    <UndoHistoryContext.Provider value={{ push, pop, stack }}>
      {children}
    </UndoHistoryContext.Provider>
  );
}

export const useUndoHistory = () => useContext(UndoHistoryContext);
