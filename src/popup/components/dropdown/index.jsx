import React from 'react';

import './dropdown.css';

export default function Dropdown({
  value = null,
  options = [],
  onChange = () => {}
}) {
  const handleSelectOnChange = (evt) => {
    onChange(evt);
  };

  const renderedOptions = options.map((option) => {
    return (
      <option value={option.value} selected={option.value == value}>
        {option.label}
      </option>
    );
  });

  const selectedOption = options.find((option) => {
    return option.value == value;
  });

  return (
    <div className="dropdown">
      <select className="dropdown__input" onChange={handleSelectOnChange}>
        {renderedOptions}
      </select>
      <div className="dropdown__label">
        {selectedOption && selectedOption.label}
      </div>
    </div>
  );
}
