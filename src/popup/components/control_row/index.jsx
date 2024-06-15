import React from 'react';

import './control_row.css';

export function ControlRow({ label, visible = true, children }) {
  return (
    <div className="control-row">
      <div className="control-row__label">{label}</div>
      {visible && <div className="control-row__control">{children}</div>}
    </div>
  );
}
