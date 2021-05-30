import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  fetchAllBookmarklets,
  executeBookmarklet
} from '../../store/actions/bookmarklets';
import {
  selectBookmarkletsWithGroup,
  selectResultsFromBookmarkletsSearch
} from '../../store/selectors/bookmarklets';
import SearchField from '../../components/search_field';
import ScrollView from '../../components/scroll_view';
import List from '../../components/list';
import OnboardMessage from '../../components/onboard_message';

import './home_screen.css';
import EmptyMessage from '../../components/empty_message';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const searchFieldRef = useRef(null);

  const [inputFocused, setInputFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const bookmarklets = useSelector(selectBookmarkletsWithGroup);
  const results = useSelector(selectResultsFromBookmarkletsSearch(searchQuery));

  const handleInputChange = (evt) => {
    const value = evt.currentTarget.value;
    setSearchQuery(value);
  };

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

  const handleItemAction = (item) => {
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

      {bookmarklets.length !== 0 && results.length !== 0 && (
        <ScrollView>
          {(scrollToElement) => {
            return (
              <List
                ref={{
                  selectedItem: onListItemRefChange.bind(null, scrollToElement)
                }}
                items={results}
                groups={[
                  { id: 'recent', title: 'Recently used' },
                  { id: null, title: 'Other scripts' }
                ]}
                onItemAction={handleItemAction}
                placeholder="Untitled script"
                disableKeyboardNavigation={!inputFocused}
              />
            );
          }}
        </ScrollView>
      )}

      {bookmarklets.length !== 0 && results.length === 0 && (
        <EmptyMessage message="No scripts found" />
      )}
      {bookmarklets.length === 0 && <OnboardMessage />}
    </div>
  );
}
