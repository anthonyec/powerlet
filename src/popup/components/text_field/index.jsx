import React from 'react';

import './text_field.css';

function TextField(
  {
    value = ''
  }
) {
  return (
    <div className="text-field">
      {value}
    </div>
  );
}

export default TextField;
