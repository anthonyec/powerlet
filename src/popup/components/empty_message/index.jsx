import React from 'react';

import './empty_message.css';

export default function EmptyMessage({ message = '', children }) {
  return (
    <div className="empty-message">
      <div className="empty-message__message">{message}</div>
      {children}
    </div>
  );
}
