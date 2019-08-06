import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  fetchAllBookmarklets,
  executeBookmarklet
} from './store/actions/bookmarklets';
import SearchList from './components/search_list';

import './reset.css';
import './app.css';

const KEYS = {
  ENTER: 13,
  UP: 38,
  DOWN: 40
}

export default function App() {
  const inputEl = useRef(null);
  const bookmarklets = useSelector((state) => state.bookmarklets.all)
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentItem, setCurrentItem] = useState();

  useEffect(() => {
    inputEl.current.focus();

    dispatch(fetchAllBookmarklets());
  }, []);

  const execute = (url) => {
    dispatch(executeBookmarklet(url));
    window.close();
  };

  const handleSpecialKey = (evt) => {
    switch(evt.keyCode) {
      case KEYS.ENTER:
        if (currentItem.url) {
          execute(currentItem.url);
        }
        break;
      case KEYS.UP:
        if (selectedIndex > 0) {
          setSelectedIndex(selectedIndex - 1);
        }
        break;
      case KEYS.DOWN:
        if (selectedIndex < totalItems - 1) {
          setSelectedIndex(selectedIndex + 1);
        }
        break;
      default:
    }
  };

  const handleInputChange = (evt) => {
    if (evt.keyCode) {

      switch(evt.keyCode) {
        case KEYS.ENTER:
        case KEYS.UP:
        case KEYS.DOWN:
          evt.preventDefault();
          handleSpecialKey(evt);
          return;
        default:
      }
    }

    setSelectedIndex(0);
    setSearchQuery(inputEl.current.value);
  };

  const handleBookmarkletClick = (url) => {
    execute(url);
  };

  const handleItemSelect = (item, total) => {
    setCurrentItem(item);
    setTotalItems(total);
  };

  return (
    <div className="app">
      <input
        ref={inputEl}
        onKeyDown={handleInputChange}
        onChange={handleInputChange}
      />

      <SearchList
        query={searchQuery}
        items={bookmarklets}
        selected={selectedIndex}
        onItemClick={handleBookmarkletClick}
        onItemSelect={handleItemSelect}
      />
    </div>
  );
}
