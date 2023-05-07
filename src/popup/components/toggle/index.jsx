import React, { useState } from 'react';

import './toggle.css';

export default function Toggle({ onChange = () => {}, checked }) {
  const [isChecked, setIsChecked] = useState(checked);
  const [disableFocusStyles, setDisableFocusStyles] = useState(false);

  const handleCheckboxClicked = () => {
    setIsChecked(!isChecked);
  };

  const handleCheckboxMouseDown = (event) => {
    setDisableFocusStyles(true);
  };

  const handleCheckboxMouseUp = () => {
    setDisableFocusStyles(true);
  };

  const handleCheckboxFocus = () => {
    setDisableFocusStyles(false);
  };

  const handleCheckboxChange = (event) => {
    onChange(event.target.checked);
  };

  const toggleClassName = disableFocusStyles
    ? 'toggle toggle--disable-focus-styles'
    : 'toggle';

  return (
    <div className={toggleClassName}>
      <input
        className="toggle__input"
        type="checkbox"
        onClick={handleCheckboxClicked}
        onMouseDown={handleCheckboxMouseDown}
        onMouseUp={handleCheckboxMouseUp}
        onFocus={handleCheckboxFocus}
        onChange={handleCheckboxChange}
        defaultChecked={isChecked}
      />
      <div className="toggle__track" />
      <div className="toggle__knob" />
    </div>
  );
}
