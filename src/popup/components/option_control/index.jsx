import React from 'react';

import './option_control.css';

export default function OptionControl({
  title = '',
  description = '',
  children
}) {
  return (
    <div className="option-control">
      <div className="option-control__details">
        {title}
        {description}
      </div>

      <div className="option-control__control">{children}</div>
    </div>
  );
}
