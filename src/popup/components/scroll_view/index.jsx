import React from 'react';

import './scroll_view.css';

export default function ScrollView({ disabled, children }) {
  const scrollToElement = (targetElement) => {
    targetElement && targetElement.scrollIntoView({ block: 'nearest' });
  };

  const className = disabled ? "scroll-view scroll-view--disabled" : "scroll-view"

  return (
    <div className={className}>
      {children && typeof children === 'function' && children(scrollToElement)}
    </div>
  );
}
