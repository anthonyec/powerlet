import React, { useEffect, useRef } from 'react';
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
  selected = -1
}) {
  const fuseRef = useRef();

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
    const className = isSelected
      ? 'search-list__item search-list__item--selected'
      : 'search-list__item';

    return (
      <li
        key={item.id}
        ref={setItemRef}
        className={className}
        onClick={onItemClick.bind(null, item.url)}
        onMouseOver={onItemMouseOver.bind(null, index)}
        onMouseMove={onItemMouseMove.bind(null, index)}
      >
        {item.title}
      </li>
    );
  });

  return <ul className="search-list">{renderedItems}</ul>;
}
