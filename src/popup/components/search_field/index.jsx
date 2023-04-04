import React, { forwardRef } from 'react';

import IconButton from '../../components/icon_button';
import Icon from '../../components/icon';

import './search_field.css';

function SearchField(
  {
    onChange = () => {},
    onFocus = () => {},
    onBlur = () => {},
    onAddClick = () => {},
    placeholder = '',
    defaultValue = '',
    showBorder
  },
  ref
) {
  const className = showBorder
    ? 'search-field search-field--with-border'
    : 'search-field';

  return (
    <div className={className}>
      <input
        className="search-field__input"
        type="text"
        ref={ref}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      {/* <Button icon={<Icon name="plus"/>} className="search-field__add-button" onClick={onAddClick}/> */}
      <IconButton onClick={onAddClick}>
        <Icon name="plus" />
      </IconButton>
    </div>
  );
}

export default forwardRef(SearchField);
