import React from 'react';

import './toolbar_button.css';

export default function ToolbarButton({
  icon = null,
  onClick,
  children
}) {
  return (
    <button onClick={onClick} className="toolbar-button">
      {icon && <div className="toolbar-button__icon">{icon}</div>}
      {children}
    </button>
  );
}
