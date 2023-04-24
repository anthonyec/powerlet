import React from 'react';

import { useToast } from '../../hooks/useToast';

import './toast_area.css';

export default function ToastArea() {
  const toast = useToast();

  return (
    <div className="toast-container">
      {toast.display}
    </div>
  );
}
