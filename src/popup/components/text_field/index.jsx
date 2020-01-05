import React, { forwardRef } from 'react';

import './text_field.css';

function TextField(
  {
    onKeyDown = () => {},
    onChange = () => {},
    placeholder = '',
    defaultValue = '',
    disabled
  },
  ref
) {
  return (
    <div className="text-field">
      <input
        className="text-field__input"
        type="text"
        ref={ref}
        onKeyDown={onKeyDown}
        onChange={onChange}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        disabled={disabled}
      />
    </div>
  );
}

export default forwardRef(TextField);
