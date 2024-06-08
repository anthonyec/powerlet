import React from 'react';

import './toggle.css';

export function Toggle() {
  return (
    <div className="toggle">
      <input className="toggle__input" type="checkbox" />
      <div className="toggle__track" />
      <div className="toggle__knob" />
    </div>
  );
}
