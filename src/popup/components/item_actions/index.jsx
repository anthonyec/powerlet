import React from 'react';

import Icon from '../icon';

import './item_actions.css';

export default function ItemActions() {
  const handleActionOnClick = (evt) => {
    evt.stopPropagation();
  };

  return (
    <div className="item-actions">
      <button className="item-actions__button" onClick={handleActionOnClick}>
        <Icon name="pencil" />
      </button>
    </div>
  );
}
