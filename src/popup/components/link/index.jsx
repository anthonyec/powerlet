import React from 'react';

import './link.css';

export default function Link({ href = '', children }) {
  return (
    <a href={href} className="link">
      {children}
    </a>
  );
}
