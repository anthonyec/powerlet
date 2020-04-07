import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

import './code_editor.css';
import './prism.css';

export default function CodeEditor({ defaultValue, onChange = () => {} }) {
  const [value, setValue] = useState(defaultValue);

  // When `defaultValue` prop changes, change the local state with that value.
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleOnValueChange = (value) => {
    setValue(value);
    onChange(value);
  };

  return (
    <div className="code-editor">
      <Editor
        value={value}
        onValueChange={handleOnValueChange}
        highlight={code => highlight(code, languages.js)}
      />
      {/* <Editor
        value={value}
        /> */}
        {/* onValueChange={handleOnChange} */}
    </div>
  );
}
