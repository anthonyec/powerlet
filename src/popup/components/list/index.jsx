import React, { useEffect, useState } from 'react';

import './list.css';

const KEYS = {
  ENTER: 13,
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  LEFT: 37
};

// Return an array of concatenated ids. This is used for useEffect which only
// shallow compares. Thus would always render when an array is used instead
// of a string or number.
// E.g [{ id: 3 }, { id: 2 }] becomes '32'.
function getArrayAsStringOfIds(array) {
  return array.map((item) => item.id).join('');
}

const List = React.forwardRef(
  (
    {
      items,
      placeholder = '',
      disableKeyboardNavigation,
      onItemClick = () => {}
    },
    ref
  ) => {
    const [selectedItemIndex, setSelectedItemIndex] = useState(0);

    const handleItemClick = (item) => {
      onItemClick(item);
    };

    const handleItemEnter = () => {
      const item = items[selectedItemIndex];
      onItemClick(item);
    };

    const getPrevIndex = () => {
      const calculatedIndex = selectedItemIndex - 1;
      return calculatedIndex < 0 ? items.length - 1 : calculatedIndex;
    };

    const getNextIndex = () => {
      const calculatedIndex = selectedItemIndex + 1;
      return calculatedIndex > items.length - 1 ? 0 : calculatedIndex;
    };

    const handleKeyDown = (evt) => {
      switch (evt.keyCode) {
        case KEYS.ENTER:
          evt.preventDefault();
          handleItemEnter();
          break;

        case KEYS.UP:
          evt.preventDefault();
          setSelectedItemIndex(getPrevIndex());
          break;

        case KEYS.DOWN:
          evt.preventDefault();
          setSelectedItemIndex(getNextIndex());
          break;

        default:
      }
    };

    useEffect(() => {
      if (disableKeyboardNavigation) {
        return;
      }

      window.document.addEventListener('keydown', handleKeyDown);

      return () => {
        window.document.removeEventListener('keydown', handleKeyDown);
      };

      // TODO: Is adding and removing event listeners this frequently a bad thing?
    }, [
      disableKeyboardNavigation,
      selectedItemIndex,
      getArrayAsStringOfIds(items)
    ]);

    // Reset selected to first item when `items` change to avoid selected being
    // out of bounds when the array length changes.
    useEffect(() => {
      setSelectedItemIndex(0);
    }, [getArrayAsStringOfIds(items)]);

    const renderedItems = items.map((item, index) => {
      const isSelected = index === selectedItemIndex;
      const className = isSelected
        ? 'list__item list__item--selected'
        : 'list__item';

      return (
        <li
          key={item.id}
          ref={isSelected ? ref.selectedItem : null}
          className={className}
          onClick={handleItemClick.bind(null, item)}
        >
          <div className="list__text">{item.title || placeholder}</div>
        </li>
      );
    });

    return <div className="list">{renderedItems}</div>;
  }
);

export default List;
