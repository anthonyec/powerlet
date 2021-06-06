import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  fetchAllBookmarklets,
  executeBookmarklet
} from '../../store/actions/bookmarklets';
import { selectBookmarkletsWithGroup } from '../../store/selectors/bookmarklets';
import { selectTranslations } from '../../store/selectors/locale';
import useFuzzyFilter from './use_fuzzy_filter';
import useSortByRecent from './use_sort_by_recent';
import SearchField from '../../components/search_field';
import ScrollView from '../../components/scroll_view';
import List from '../../components/list';
import OnboardMessage from '../../components/onboard_message';

import './home_screen.css';

const ENABLE_GROUPS = false;

export default function HomeScreen() {
  const dispatch = useDispatch();
  const searchFieldRef = useRef(null);
  const [inputFocused, setInputFocused] = useState(false);
  const translations = useSelector(selectTranslations);
  const bookmarklets = useSelector(selectBookmarkletsWithGroup);
  const [fuzzyFilterResults, fuzzyFilter] = useFuzzyFilter(bookmarklets);

  // TODO: Is this ok to be a hook or should it be a normal function? Is order
  // dependent hooks a naughty pattern?
  const sortedResults = useSortByRecent(fuzzyFilterResults);
  const results = ENABLE_GROUPS ? sortedResults : fuzzyFilterResults;
  const listGroups = ENABLE_GROUPS
    ? [
        { id: 'recent', title: translations['recently_used_heading'] },
        { id: null, title: translations['other_scripts_heading'] }
      ]
    : [];

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
        placeholder={translations['search_scripts_placeholder']}
      />

      {bookmarklets.length !== 0 && (
        <ScrollView>
          {(scrollToElement) => {
            return (
              <List
                ref={{
                  selectedItem: onListItemRefChange.bind(null, scrollToElement)
                }}
                items={results}
                groups={listGroups}
                onItemAction={handleItemAction}
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
