import React from 'react';

import './toast.css';

export default function Toast({
  message = '',
  label = '',
  onActionClick = () => {}
}) {
  return (
    <div className="toast">
      {message}
      <button className="toast__button" onClick={onActionClick}>
        {label}
      </button>
    </div>
  );
}
