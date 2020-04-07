import React from 'react';

import './button.css';

export default function Button({
  icon = null,
  onClick,
  className = '',
  type = 'default',
  children
}) {
  return (
    <button onClick={onClick} className={`button button--${type} ${className}`}>
      {icon && <div className="button__icon">{icon}</div>}
      {children}
    </button>
  );
}
