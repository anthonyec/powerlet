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

  const getPrevIndex = () => {
    const calculatedIndex = selectedIndex - 1;
    return calculatedIndex < 0 ? totalItems - 1 : calculatedIndex;
  };

  const getNextIndex = () => {
    const calculatedIndex = selectedIndex + 1;
    return calculatedIndex > totalItems - 1 ? 0 : calculatedIndex;
  };

  const handleSpecialKey = (evt) => {
    switch(evt.keyCode) {
      case KEYS.ENTER:
        if (currentItem.url) {
          execute(currentItem.url);
        }
        break;
      case KEYS.UP:
        setSelectedIndex(getPrevIndex());
        break;
      case KEYS.DOWN:
        setSelectedIndex(getNextIndex());
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

  const handleItemMouseOverAndMove = (index) => {
    setSelectedIndex(index);
  };

  return (
    <div className="app">
      <input
        ref={inputEl}
        onKeyDown={handleInputChange}
        onChange={handleInputChange}
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      />

      <SearchList
        query={searchQuery}
        items={bookmarklets}
        selected={selectedIndex}
        onItemClick={handleBookmarkletClick}
        onItemSelect={handleItemSelect}
        onItemMouseOver={handleItemMouseOverAndMove}
        onItemMouseMove={handleItemMouseOverAndMove}
      />
    </div>
  );
}
