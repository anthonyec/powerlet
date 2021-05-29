import React from 'react';

import './scroll_view.css';

export default function ScrollView({ children }) {
  const scrollToElement = (targetElement) => {
    targetElement && targetElement.scrollIntoView({ block: 'nearest' });
  };

  return (
    <div className="scroll-view">
      {children && typeof children === 'function' && children(scrollToElement)}
    </div>
  );
}
