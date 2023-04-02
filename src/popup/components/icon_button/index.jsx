import React from 'react';

import "./icon_button.css"

export default function IconButton({ children, onClick = () => {} }) {
  return (
    <button className="icon-button" onClick={onClick}>
      {children}
    </button>
  )
}
