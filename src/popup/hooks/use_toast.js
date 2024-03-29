import React, { createContext, useContext, useEffect, useState } from 'react';

import Toast from '../components/toast';

const DEFAULT_TOAST_OPTIONS = { message: '', label: '', action: () => {} };

const ToastContext = createContext({
  display: null,
  show: (options = DEFAULT_TOAST_OPTIONS) => {},
  hide: () => {}
});

export function ToastProvider({ children }) {
  const [showToast, setShowToast] = useState(false);
  const [options, setOptions] = useState(DEFAULT_TOAST_OPTIONS);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowToast(false);
    }, 8_000);

    return () => {
      clearTimeout(timeout);
    };
  }, [showToast]);

  const show = ({ message, label, action }) => {
    setOptions({ message, label, action });
    setShowToast(true);
  };

  const hide = () => {
    setShowToast(false);
    setOptions(DEFAULT_TOAST_OPTIONS);
  };

  const display = showToast ? (
    <Toast
      message={options.message}
      label={options.label}
      onActionClick={options.action}
    />
  ) : null;

  return (
    <ToastContext.Provider value={{ show, hide, display }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
