import React, { useState, useEffect } from 'react';

import './text_field.css';

export default function TextField({
  label = '',
  defaultValue = '',
  onChange = () => {}
}) {
  const [value, setValue] = useState(defaultValue);

  // When `defaultValue` prop changes, change the local state with that value.
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleOnChange = (evt) => {
    setValue(evt.target.value);
    onChange(evt.target.value);
  };

  return (
    <div>
      {label}:
      <input type="text" value={value} onChange={handleOnChange} />
    </div>
  );
}
