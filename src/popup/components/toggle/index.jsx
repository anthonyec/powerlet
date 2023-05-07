import React, { useEffect, useState } from 'react';

import './toggle.css';

export default function Toggle({ onChange = () => {}, checked }) {
  const [isChecked, setIsChecked] = useState(checked);
  const [mouseDownPosition, setMouseDownPosition] = useState(null);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (mouseDownPosition !== null) {
        const x = event.clientX;
        const difference = Math.abs(mouseDownPosition.x - x);

        setIsChecked(difference > 10 && x > mouseDownPosition.x);
      }
    };

    const handleMouseUp = () => {
      setMouseDownPosition(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseDownPosition]);

  const handleCheckboxClicked = () => {
    setIsChecked(!isChecked);
  };

  const handleCheckboxMouseDown = (event) => {
    setIsClicked(true);
    setMouseDownPosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleCheckboxMouseUp = () => {
    setIsClicked(true);
  };

  const handleCheckboxFocus = () => {
    setIsClicked(false);
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.checked;
    onChange(value);
  };

  const toggleClassName = isClicked ? 'toggle toggle--clicked' : 'toggle';

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
