import React, { useState, useEffect } from 'react';

import './code_editor.css';

export default function CodeEditor({ defaultValue, onChange = () => {} }) {
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
    <textarea cols="60" rows="20" onChange={handleOnChange} value={value} />
  );
}
