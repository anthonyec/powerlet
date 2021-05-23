import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  fetchAllBookmarklets,
  executeBookmarklet
} from '../../store/actions/bookmarklets';
import { selectBookmarkletsWithGroup } from '../../store/selectors/bookmarklets';
import useFuzzyFilter from './use_fuzzy_filter';
import useSortByRecent from './use_sort_by_recent';
import SearchField from '../../components/search_field';
import ScrollView from '../../components/scroll_view';
import List from '../../components/list';
import OnboardMessage from '../../components/onboard_message';

import './home_screen.css';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const searchFieldRef = useRef(null);
  const [inputFocused, setInputFocused] = useState(false);
  const bookmarklets = useSelector(selectBookmarkletsWithGroup);
  const [fuzzyFilterResults, fuzzyFilter] = useFuzzyFilter(bookmarklets);

  // TODO: Is this ok to be a hook or should it be a normal function? Is order
  // dependent hooks a naughty pattern?
  const sortedResults = useSortByRecent(fuzzyFilterResults);

  const handleInputChange = (evt) => {
    const value = evt.currentTarget.value;
    fuzzyFilter(value);
  };

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

  const handleItemClick = (item) => {
    dispatch(executeBookmarklet(item.id, item.url));
    window.close();
  };

  const onListItemRefChange = useCallback((scrollToElement, element) => {
    // TODO: Why is it null on first render? Because it's mounting?
    if (element !== null) {
      scrollToElement(element);
    }
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
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder="Search scripts"
      />

      {bookmarklets.length !== 0 && (
        <ScrollView>
          {(scrollToElement) => {
            return (
              <List
                ref={{
                  selectedItem: onListItemRefChange.bind(null, scrollToElement)
                }}
                items={sortedResults}
                groups={[
                  { id: 'recent', title: 'Recently used' },
                  { id: null, title: 'Other scripts' }
                ]}
                onItemClick={handleItemClick}
                placeholder="Untitled script"
                disableKeyboardNavigation={!inputFocused}
              />
            );
          }}
        </ScrollView>
      )}

      {bookmarklets.length === 0 && <OnboardMessage />}
    </div>
  );
}
