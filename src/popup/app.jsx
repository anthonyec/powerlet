import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  fetchAllBookmarklets,
  executeBookmarklet,
  addExampleBookmarklets
} from './store/actions/bookmarklets';
import SearchList from './components/search_list';

import './reset.css';
import './app.css';
import './onboard.css';

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

  const handleExampleOnClick = () => {
    dispatch(addExampleBookmarklets());
    dispatch(fetchAllBookmarklets());
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

      {bookmarklets.length !== 0 &&
        <SearchList
          query={searchQuery}
          items={bookmarklets}
          selected={selectedIndex}
          onItemClick={handleBookmarkletClick}
          onItemSelect={handleItemSelect}
          onItemMouseOver={handleItemMouseOverAndMove}
          onItemMouseMove={handleItemMouseOverAndMove}
        />
      }

      {bookmarklets.length === 0 &&
        <div className="onboard">
          <div className="onboard__message">
            You don't have any bookmarks&nbsp;scripts.
          </div>

          <button onClick={handleExampleOnClick} className="onboard__button">
            Add Example Scripts
          </button>
        </div>
      }
    </div>
  );
}
