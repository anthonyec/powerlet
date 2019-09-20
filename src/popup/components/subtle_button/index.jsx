import React from 'react';

import './subtle_button.css';

export default function SubtleButton({ onClick, className = '', children }) {
  return (
    <button onClick={onClick} className={`subtle-button ${className}`}>
      {children}
    </button>
  );
}
