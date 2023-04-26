import React, { createContext, useContext, useEffect, useState } from 'react';

import Toast from '../components/toast';

const DEFAULT_TOAST_DETAILS = { message: '', label: '', action: () => {} };

const ToastContext = createContext({
  display: null,
  show: (options = { message: '', label: '', action: () => {} }) => {},
  hide: () => {}
});

export function ToastProvider({ children }) {
  const [showToast, setShowToast] = useState(false);
  const [details, setDetails] = useState(DEFAULT_TOAST_DETAILS);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowToast(false);
    }, 8_000);

    return () => {
      clearTimeout(timeout);
    };
  }, [showToast]);

  const show = ({ message, label, action }) => {
    setDetails({ message, label, action });
    setShowToast(true);
  };

  const hide = () => {
    setShowToast(false);
    setDetails(DEFAULT_TOAST_DETAILS);
  };

  const display = showToast ? (
    <Toast
      message={details.message}
      label={details.label}
      onActionClick={details.action}
    />
  ) : null;

  return (
    <ToastContext.Provider value={{ show, hide, display }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
