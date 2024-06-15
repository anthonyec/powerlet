import React from 'react';

import './toggle.css';

export function Toggle({ value, onChange }) {
  return (
    <div className="toggle">
      <input
        className="toggle__input"
        type="checkbox"
        checked={value}
        onChange={onChange}
      />
      <div className="toggle__track" />
      <div className="toggle__knob" />
    </div>
  );
}
