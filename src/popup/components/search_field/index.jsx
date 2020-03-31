import React, { forwardRef } from 'react';

import './search_field.css';

function SearchField(
  {
    onKeyDown = () => {},
    onChange = () => {},
    placeholder = '',
    defaultValue = ''
  },
  ref
) {
  return (
    <div className="search-field">
      <input
        className="search-field__input"
        type="text"
        ref={ref}
        onKeyDown={onKeyDown}
        onChange={onChange}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    </div>
  );
}

export default forwardRef(SearchField);
