import React from 'react';

import './option_control.css';

export default function OptionControl({
  title = '',
  description = '',
  onClick = () => {},
  children
}) {
  return (
    <div className="option-control" onClick={onClick}>
      <div className="option-control__details">
        <div className="option-control__title">{title}</div>
        {description && <div className="option-control__description">{description}</div>}
      </div>

      <div className="option-control__control">{children}</div>
    </div>
  );
}
