import React, { createContext, useContext } from 'react';

const ToastContext = createContext({
  show: (message, action) => {}
});

export function ToastProvider({ children }) {
  const show = (message, action) => {
    console.log("SHOW TOAST");
  };

  return (
    <ToastContext.Provider value={{ show }}>{children}</ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
