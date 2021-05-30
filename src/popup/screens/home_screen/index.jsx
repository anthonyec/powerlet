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
import EmptyMessage from '../../components/empty_message';

import './home_screen.css';

export default function HomeScreen() {
  const dispatch = useDispatch();

  const searchFieldRef = useRef(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const bookmarklets = useSelector(selectBookmarkletsWithGroup);
  const results = useSelector(selectResultsFromBookmarkletsSearch(searchQuery));

  const hasBookmarklets = bookmarklets.length !== 0;
  const hasSearchResults = results.length !== 0;
  const doesNotHaveBookmarklets = bookmarklets.length === 0;
  const doesNotHaveSearchResults = results.length === 0;

  useEffect(() => {
    dispatch(fetchAllBookmarklets());
    searchFieldRef.current && searchFieldRef.current.focus();
  }, []);

  const handleSearchFieldChange = (evt) => {
    const value = evt.currentTarget.value;
    setSearchQuery(value);
  };

  const handleSearchFieldFocus = () => {
    setInputFocused(true);
  };

  const handleSearchFieldBlur = () => {
    setInputFocused(false);
  };

  const handleListItemAction = (item) => {
    dispatch(executeBookmarklet(item.id, item.url));
    window.close();
  };

  const onListItemRefChange = useCallback((scrollToElement, element) => {
    // TODO: Why is it null on first render? Because it's mounting?
    if (element !== null) {
      scrollToElement(element);
    }
  }, []);

  return (
    <div className="home-screen">
      <SearchField
        ref={searchFieldRef}
        onChange={handleSearchFieldChange}
        onFocus={handleSearchFieldFocus}
        onBlur={handleSearchFieldBlur}
        placeholder="Search scripts"
      />

      {hasBookmarklets && hasSearchResults && (
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
                onItemAction={handleListItemAction}
                placeholder="Untitled script"
                disableKeyboardNavigation={!inputFocused}
              />
            );
          }}
        </ScrollView>
      )}

      {hasBookmarklets && doesNotHaveSearchResults && (
        <EmptyMessage message="No scripts found" />
      )}

      {doesNotHaveBookmarklets && <OnboardMessage />}
    </div>
  );
}
