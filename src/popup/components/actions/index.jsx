import React from 'react';

import './actions.css';

export default function Actions({ children }) {
  return (
    <div className="actions">
      {React.Children.map(children, (child) => {
        return (
          <div className="actions__item">
            {child}
          </div>
        );
      })}
    </div>
  );
}
