import React from 'react';

import Icon from '../icon';

import './item_actions.css';

export default function ItemActions({
  onEditClick = null,
  onShareClick = null
}) {
  const handleEditOnClick = (evt) => {
    evt.stopPropagation();
    onEditClick();
  };

  const handleShareOnClick = (evt) => {
    evt.stopPropagation();
    onShareClick();
  };

  return (
    <div className="item-actions">
      {onShareClick && (
        <button
          className="item-actions__button"
          onClick={handleShareOnClick}
          title="Share script"
        >
          <Icon name="share" />
        </button>
      )}
      {onEditClick && (
        <button
          className="item-actions__button"
          onClick={handleEditOnClick}
          title="Edit script"
        >
          <Icon name="pencil" />
        </button>
      )}
    </div>
  );
}
