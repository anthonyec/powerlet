import React, { forwardRef } from 'react';

import Icon from '../../components/icon';
import IconButton from '../../components/icon_button';

import './search_field.css';

function SearchField(
  {
    onChange = () => {},
    onFocus = () => {},
    onBlur = () => {},
    onAddClick = () => {},
    placeholder = '',
    defaultValue = '',
    showBorder,
    disabled
  },
  ref
) {
  return (
    <div className="search-field">
      <input
        className="search-field__input"
        type="text"
        ref={ref}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      <IconButton className="search-field__add-button" onClick={onAddClick}>
        <Icon name="plus" />
      </IconButton>
    </div>
  );
}

export default forwardRef(SearchField);
