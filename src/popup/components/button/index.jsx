import React from 'react';

import './button.css';

export default function Button({
  icon = null,
  onClick,
  className = '',
  children
}) {
  return (
    <button onClick={onClick} className={`button ${className}`}>
      {icon && <div className="button__icon">{icon}</div>}
      {children}
    </button>
  );
}
