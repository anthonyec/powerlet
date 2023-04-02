import React from 'react';

import "./icon_button.css"

export default function IconButton({ className = "", onClick = () => {}, children }) {
  return (
    <button className={`icon-button ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}
