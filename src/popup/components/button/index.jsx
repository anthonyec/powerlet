import React from 'react';

import './button.css';

export default function Button({ onClick, className = '', children }) {
  return (
    <button onClick={onClick} className={`button ${className}`}>
      {children}
    </button>
  );
}
