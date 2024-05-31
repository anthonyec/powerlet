import React from 'react';

import Icon from '../icon';
import IconButton from '../icon_button';

import './item_actions.css';

export default function ItemActions({ disabled, onEditClick = () => {} }) {
  const handleEditOnClick = (evt) => {
    evt.stopPropagation();
    onEditClick();
  };

  return (
    <div className="item-actions">
      <IconButton onClick={handleEditOnClick} disabled={disabled}>
        <Icon name="pencil" />
      </IconButton>
    </div>
  );
}
