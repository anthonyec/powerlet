import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  fetchAllBookmarklets,
  executeBookmarklet
} from '../../store/actions/bookmarklets';

import useFuzzyFilter from './use_fuzzy_filter';
import SearchField from '../../components/search_field';
import ScrollView from '../../components/scroll_view';
import List from '../../components/list';
import OnboardMessage from '../../components/onboard_message';
import Toolbar from '../../components/toolbar';
import Icon from '../../components/icon';
import Button from '../../components/button';

import './home_screen.css';

const HIDE_EDITOR = true;

export default function HomeScreen() {
  const dispatch = useDispatch();
  const searchFieldRef = useRef(null);
  const [listSelectedItemRef, setListSelectedItemRef] = useState(null);
  const bookmarklets = useSelector((state) => state.bookmarklets.all);
  const [fuzzyFilterResults, fuzzyFilter] = useFuzzyFilter(bookmarklets);

  const handleInputChange = (evt) => {
    const value = evt.currentTarget.value;
    fuzzyFilter(value);
  };

  const handleItemClick = (item) => {
    dispatch(executeBookmarklet(item.id, item.url));
    window.close();
  };

  const onListItemRefChange = useCallback((element) => {
    // TODO: Why is it null on first render? Because it's mounting?
    setListSelectedItemRef(element);
  }, []);

  useEffect(() => {
    dispatch(fetchAllBookmarklets());
    searchFieldRef.current && searchFieldRef.current.focus();
  }, []);

  return (
    <div className="home-screen">
      <SearchField
        ref={searchFieldRef}
        onChange={handleInputChange}
        placeholder="Search scripts"
      />

      {bookmarklets.length !== 0 && (
        <ScrollView targetRef={listSelectedItemRef}>
          <List
            ref={{ selectedItem: onListItemRefChange }}
            items={fuzzyFilterResults}
            onItemClick={handleItemClick}
            placeholder="Untitled script"
          />
        </ScrollView>
      )}

      {bookmarklets.length === 0 && <OnboardMessage />}

      {!HIDE_EDITOR && bookmarklets.length !== 0 && (
        <Toolbar>
          <Button
            type="toolbar"
            icon={<Icon name="plus" />}
            onClick={handleOnNewClick}
          >
            Create new script
          </Button>
        </Toolbar>
      )}
    </div>
  );
}
