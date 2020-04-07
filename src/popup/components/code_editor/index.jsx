import React, { useState, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

require('codemirror/mode/javascript/javascript');
require('codemirror/addon/edit/closebrackets');

import './code_editor.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

const CODE_MIRROR_OPTIONS = {
  tabSize: 2,
  lineNumbers: true,
  autoCloseBrackets: true,
  theme: 'default'
};

export default function CodeEditor({ defaultValue, onChange = () => {} }) {
  const [value, setValue] = useState(defaultValue);
  const [options, setOptions] = useState(CODE_MIRROR_OPTIONS);

  const handleOnColorSchemeChange = (evt) => {
    const isDarkTheme = evt.matches;
    const theme = isDarkTheme ? 'material' : 'default';

    setOptions({
      ...CODE_MIRROR_OPTIONS,
      theme
    });
  };

  useEffect(() => {
    const schemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    handleOnColorSchemeChange(schemeMediaQuery);
    schemeMediaQuery.addListener(handleOnColorSchemeChange);

    return () => {
      schemeMediaQuery.removeListener(handleOnColorSchemeChange);
    }
  }, []);

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
      <CodeMirror
        value={value}
        onBeforeChange={(editor, data, value) => {
          handleOnChange(value);
        }}
        options={options}
      />
    </div>
  );
}
