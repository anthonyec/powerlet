import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  fetchAllBookmarklets,
  executeBookmarklet
} from '../../store/actions/bookmarklets';
import {
  selectBookmarkletGroups,
  selectBookmarkletsWithGroup,
  selectResultsFromBookmarkletsSearch
} from '../../store/selectors/bookmarklets';
import { selectTranslations } from '../../store/selectors/locale';

import useCloseWindowAfterExecution from './use_close_window_after_execution';

import SearchField from '../../components/search_field';
import ScrollView from '../../components/scroll_view';
import List from '../../components/list';
import OnboardMessage from '../../components/onboard_message';
import EmptyMessage from '../../components/empty_message';
import { useUndoHistory } from '../../hooks/useUndoHistory';

import './home_screen.css';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const setExecutedScript = useCloseWindowAfterExecution();
  const undoHistory = useUndoHistory();

  const searchFieldRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const isLoaded = useSelector((state) => state.bookmarklets.loaded);
  const translations = useSelector(selectTranslations);
  const bookmarklets = useSelector(selectBookmarkletsWithGroup);
  const results = useSelector(
    selectResultsFromBookmarkletsSearch(deferredSearchQuery)
  );
  const groups = useSelector(selectBookmarkletGroups);

  const hasBookmarklets = bookmarklets.length !== 0;
  const hasSearchResults = results.length !== 0;
  const doesNotHaveBookmarklets = bookmarklets.length === 0;
  const doesNotHaveSearchResults = results.length === 0;

  useEffect(() => {
    searchFieldRef.current && searchFieldRef.current.focus();

    const handleBookmarksChange = () => {
      dispatch(fetchAllBookmarklets());
    };

    handleBookmarksChange();
    chrome.bookmarks.onChanged.addListener(handleBookmarksChange);
    chrome.bookmarks.onCreated.addListener(handleBookmarksChange);
    chrome.bookmarks.onRemoved.addListener(handleBookmarksChange);

    return () => {
      chrome.bookmarks.onChanged.removeListener(handleBookmarksChange);
      chrome.bookmarks.onCreated.removeListener(handleBookmarksChange);
      chrome.bookmarks.onRemoved.removeListener(handleBookmarksChange);
    };
  }, []);

  const handleSearchFieldChange = (evt) => {
    const value = evt.currentTarget.value;
    setSearchQuery(value);
  };

  const handleAddClick = () => {
    window.location.hash = 'edit/new';
  };

  const handleListItemAction = (item) => {
    setExecutedScript(item.id);
    dispatch(executeBookmarklet(item.id, item.url));
  };

  const handleListItemEditClick = (item) => {
    window.location.hash = `edit/${item.id}`;
  };

  const onListItemRefChange = useCallback((scrollToElement, element) => {
    // TODO: Why is it null on first render? Because it's mounting?
    if (element !== null) {
      scrollToElement(element);
    }
  }, []);

  console.log(undoHistory);

  return (
    <div className="home-screen">
      <SearchField
        ref={searchFieldRef}
        onChange={handleSearchFieldChange}
        onAddClick={handleAddClick}
        placeholder={translations['search_scripts_placeholder']}
        showBorder={groups}
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
                groups={groups}
                placeholder="Untitled script"
                onItemAction={handleListItemAction}
                onEditClick={handleListItemEditClick}
              />
            );
          }}
        </ScrollView>
      )}

      {hasBookmarklets && doesNotHaveSearchResults && (
        <EmptyMessage message={translations['no_search_results_message']} />
      )}

      {isLoaded && doesNotHaveBookmarklets && <OnboardMessage />}
    </div>
  );
}
