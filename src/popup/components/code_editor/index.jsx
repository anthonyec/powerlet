import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-github';

import './code_editor.css';

export default function CodeEditor({ defaultValue, onChange = () => {} }) {
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [theme, setTheme] = useState('terminal');

  const handleOnColorSchemeChange = (evt) => {
    const isDarkTheme = evt.matches;

    if (isDarkTheme) {
      setTheme('terminal');
    } else {
      setTheme('github');
    }
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
        theme={theme}
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
