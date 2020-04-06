import React, { useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';

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
    <div className="code-editor">
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        value={value}
      />
    </div>
  );
}
