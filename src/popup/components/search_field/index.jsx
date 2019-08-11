import React, { forwardRef } from 'react';

import './search_field.css';

function SearchField({
  onKeyDown = () => {},
  onChange = () => {},
  placeholder = '',
  defaultValue = ''
}, ref) {
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
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      />
    </div>
  );
};

export default forwardRef(SearchField);
