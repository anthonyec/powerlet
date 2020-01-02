import React, { forwardRef } from 'react';

import './search_field.css';

function SearchField(
  {
    onKeyDown = () => {},
    onChange = () => {},
    placeholder = '',
    defaultValue = '',
    shortcut = ''
  },
  ref
) {
  const shortcutClassName = shortcut
    ? 'search-field__shortcut'
    : 'search-field__shortcut search-field__shortcut--hidden';

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
      <div className={shortcutClassName}>⌥⌘K</div>
    </div>
  );
}

export default forwardRef(SearchField);
