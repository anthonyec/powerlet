import React from 'react';

import Icon from '../icon';

import './item_actions.css';

export default function ItemActions({
  onEditClick = () => {}
}) {
  const handleEditOnClick = (evt) => {
    evt.stopPropagation();
    onEditClick();
  };
 
  return (
    <div className="item-actions">
      <button className="item-actions__button" onClick={handleEditOnClick}>
        <Icon name="pencil" />
      </button>
    </div>
  );
}
