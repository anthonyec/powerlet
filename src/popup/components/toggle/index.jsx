import React, { useState } from 'react';

import './toggle.css';

export default function Toggle({ checked }) {
  const [clicked, setClicked] = useState();

  const handleCheckboxMouseDown = () => {
    setClicked(true);
  };

  const handleCheckboxFocus = () => {
    setClicked(false);
  };

  const toggleClassName = clicked ? 'toggle toggle--clicked' : 'toggle';

  return (
    <div className={toggleClassName}>
      <input
        className="toggle__input"
        type="checkbox"
        onMouseDown={handleCheckboxMouseDown}
        onMouseUp={handleCheckboxMouseDown}
        onFocus={handleCheckboxFocus}
        defaultChecked={checked}
      />
      <div className="toggle__track" />
      <div className="toggle__knob" />
    </div>
  );
}
