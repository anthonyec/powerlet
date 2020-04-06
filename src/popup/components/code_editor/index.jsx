import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/webpack-resolver';
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-terminal";


import './code_editor.css';

export default function CodeEditor({ defaultValue, onChange = () => {} }) {
  const [value, setValue] = useState(defaultValue);

  // When `defaultValue` prop changes, change the local state with that value.
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleOnChange = (value) => {
    setValue(value);
    onChange(value);
  };

  return (
    <div className="code-editor">
      <AceEditor
        className="code-editor__input"
        value={value}
        mode="javascript"
        theme="terminal"
        fontSize="14"
        tabSize="2"
        onChange={handleOnChange}
      />
    </div>
  );
}
