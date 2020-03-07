import React, { useEffect, useRef, useState } from 'react';
import Fuse from 'fuse.js';

import './search_list.css';

// Return an array of concatenated ids. This is used for useEffect which only
// shallow compares. Thus would always render when an array is used instead
// of a string or number.
// E.g [{ id: 3 }, { id: 2 }] becomes '32'.
function getArrayAsStringOfIds(array) {
  return array.map((item) => item.id).join('');
}

export default function SearchList({
  items = [],
  query = '',
  onChange = () => {},
  onItemClick = () => {},
  onItemSelect = () => {},
  onItemMouseOver = () => {},
  onItemMouseMove = () => {},
  setItemRef = () => {},
  selected = -1,
  renderItemActions
}) {
  const fuseRef = useRef();
  const [currentMouseOverIndex, setCurrentMouseOverIndex] = useState(-1);

  const handleItemMouseOver = (index) => {
    onItemMouseOver.bind(null, index)
    setCurrentMouseOverIndex(index);
  };

  const handleMouseLeave = () => {
    setCurrentMouseOverIndex(-1);
  };

  useEffect(() => {
    fuseRef.current = new Fuse(items, {
      shouldSort: true,
      threshold: 0.6,
      location: 2,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 0,
      keys: ['title']
    });
  }, [items]);

  const filteredItems =
    query && fuseRef.current ? fuseRef.current.search(query) : items;

  useEffect(() => {
    onItemSelect(filteredItems[selected], filteredItems.length);
  }, [selected]);

  useEffect(() => {
    onChange(filteredItems[selected], filteredItems.length);
  }, [getArrayAsStringOfIds(filteredItems)]);

  const renderedItems = filteredItems.map((item, index) => {
    const isSelected = index === selected;
    const isMouseOver = index === currentMouseOverIndex;
    const className = isSelected
      ? 'search-list__item search-list__item--selected'
      : 'search-list__item';

    return (
      <li
        key={item.id}
        ref={setItemRef}
        className={className}
        onClick={onItemClick.bind(null, item.url)}
        onMouseOver={handleItemMouseOver.bind(null, index)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={onItemMouseMove.bind(null, index)}
      >
        <div className="search-list__text">
          {item.title || 'Untitled script'}
        </div>

        <div className="search-list__actions">
          {renderItemActions(item, isSelected, isMouseOver)}
        </div>
      </li>
    );
  });

  return <ul className="search-list">{renderedItems}</ul>;
}
