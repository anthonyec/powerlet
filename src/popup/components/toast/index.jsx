import React from 'react';

import './toast_container.css';
import './toast.css';

export default function Toast({
  message = '',
  label = '',
  onActionClick = () => {}
}) {
  return (
    <div className="toast-container">
      <div className="toast">
        {message}
        <button className="toast__button" onClick={onActionClick}>
          {label}
        </button>
      </div>
    </div>
  );
}
