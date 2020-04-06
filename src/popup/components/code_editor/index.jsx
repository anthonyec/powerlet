import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-terminal';

import './code_editor.css';

export default function CodeEditor({ defaultValue, onChange = () => {} }) {
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);

  // When `defaultValue` prop changes, change the local state with that value.
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleOnChange = (value) => {
    setValue(value);
    onChange(value);
  };

  const handleOnFocus = () => {
    setFocused(true);
  };

  const handleOnBlur = () => {
    setFocused(false);
  };

  const className = focused
    ? 'code-editor code-editor--focus'
    : 'code-editor';

  return (
    <div className={className}>
      <AceEditor
        className="code-editor__input"
        value={value}
        mode="javascript"
        theme="terminal"
        fontSize={13}
        wrapEnabled={true}
        tabSize="2"
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      />
    </div>
  );
}
