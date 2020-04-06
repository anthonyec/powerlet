import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/webpack-resolver';

// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/theme-github";


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
      <AceEditor onChange={handleOnChange} value={value} />
      <textarea
        className="code-editor__input"
        onChange={handleOnChange}
        value={value}
        spellCheck={false}
      />
    </div>
  );
}
