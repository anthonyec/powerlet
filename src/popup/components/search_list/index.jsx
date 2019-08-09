import React, { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';

import './search_list.css';

export default function SearchList({
  items = [],
  query = '',
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
      threshold: 0.4,
      tokenize: true,
      location: 0,
      distance: 0,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      includeMatches: true,
      keys: ['title']
    });
  }, [items]);

  const filteredItems =
    query && fuseRef.current ? fuseRef.current.search(query) : items;

  useEffect(() => {
    onItemSelect(filteredItems[selected], filteredItems.length);
  }, [selected, filteredItems.length]);

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
