import React, { forwardRef } from 'react';

import './icon_button.css';

const IconButton = forwardRef(function IconButton(
  { className = '', onClick = () => {}, disabled, children },
  ref
) {
  return (
    <button ref={ref} className={`icon-button ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
});

export default IconButton;
