import React from 'react';

import { useToast } from '../../hooks/useToast';

import './toast_area.css';

export default function ToastArea() {
  const toast = useToast();

  if (!toast.display) {
    return null;
  }

  return <div className="toast-area">{toast.display}</div>;
}
