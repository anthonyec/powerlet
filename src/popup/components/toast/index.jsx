import React from 'react';

import './toast.css';

export default function Toast({
  inline,
  warning,
  message = '',
  label = '',
  onActionClick = () => {}
}) {
  let className = 'toast';

  if (inline) {
    className += ' toast--inline';
  }

  if (warning) {
    className += ' toast--warning';
  }

  return (
    <div className={className}>
      {message}
      <button className="toast__button" onClick={onActionClick}>
        {label}
      </button>
    </div>
  );
}
