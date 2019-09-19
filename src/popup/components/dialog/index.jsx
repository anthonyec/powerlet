import React from 'react';

import './dialog.css';

export default function Dialog({ title = '', message = '', actions = null }) {
  return (
    <div className="dialog">
      <div className="dialog__message">
        {title && <h2>{title}</h2>}

        {message && <p>{message}</p>}
      </div>

      {actions}
    </div>
  );
}
