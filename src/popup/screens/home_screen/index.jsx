import React, {
  Suspense,
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  executeBookmarklet,
  fetchAllBookmarklets,
  removeNonExistentRecents
} from '../../store/actions/bookmarklets';
import {
  selectBookmarkletGroups,
  selectBookmarkletsWithGroup,
  selectResultsFromBookmarkletsSearch
} from '../../store/selectors/bookmarklets';
import { selectTranslations } from '../../store/selectors/locale';

import useCloseWindowAfterExecution from './use_close_window_after_execution';
import { useListItemContextMenu } from './use_list_item_context_menu';

import EmptyMessage from '../../components/empty_message';
import List from '../../components/list';
import OnboardMessage from '../../components/onboard_message';
import ScrollView from '../../components/scroll_view';
import SearchField from '../../components/search_field';

import './home_screen.css';

const ToastArea = React.lazy(() => import('../../components/toast_area'));
const ContextMenu = React.lazy(() => import('../../components/context_menu'));

const getInitialSelectedIndex = (results = [], route = {}) => {
  if (!route.query.selected) {
    return 0;
  }

  const id = route.query.selected;
  const index = results.findIndex((result) => {
    return result.id === id;
  });

  return index;
};

export default function HomeScreen({ route }) {
  const dispatch = useDispatch();
  const [contextMenu, setContextMenu] = useState(null);
  const [executingScriptId, setExecutingScript] = useCloseWindowAfterExecution();
  const contextMenuItems = useListItemContextMenu(contextMenu, () => {
    setInitialSelectedItem(contextMenu.index);
  });

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
  const [initialSelectedItem, setInitialSelectedItem] = useState(
    getInitialSelectedIndex(results, route)
  );

  const hasBookmarklets = bookmarklets.length !== 0;
  const hasSearchResults = results.length !== 0;
  const doesNotHaveBookmarklets = bookmarklets.length === 0;
  const doesNotHaveSearchResults = results.length === 0;

  useEffect(() => {
    searchFieldRef.current && searchFieldRef.current.focus();

    const handleBookmarksChange = () => {
      dispatch(fetchAllBookmarklets());
      dispatch(removeNonExistentRecents());
    };

    handleBookmarksChange();
    chrome.bookmarks.onChanged.addListener(handleBookmarksChange);
    chrome.bookmarks.onCreated.addListener(handleBookmarksChange);
    chrome.bookmarks.onMoved.addListener(handleBookmarksChange);
    chrome.bookmarks.onRemoved.addListener(handleBookmarksChange);

    return () => {
      chrome.bookmarks.onChanged.removeListener(handleBookmarksChange);
      chrome.bookmarks.onCreated.removeListener(handleBookmarksChange);
      chrome.bookmarks.onMoved.removeListener(handleBookmarksChange);
      chrome.bookmarks.onRemoved.removeListener(handleBookmarksChange);
    };
  }, []);

  const handleSearchFieldChange = (evt) => {
    const value = evt.currentTarget.value;
    setSearchQuery(value);
    setInitialSelectedItem(0);
  };

  const handleAddClick = () => {
    window.location.hash = 'edit/new';
  };

  const handleListItemAction = (item) => {
    setExecutingScript(item.id);
    dispatch(executeBookmarklet(item.id));
  };

  const handleListItemContextMenu = (index, item, position) => {
    setContextMenu({ index, item, position });
  };

  const handleListItemEditClick = (item) => {
    window.location.hash = `edit/${item.id}`;
  };

  const handleContextMenuDismiss = () => {
    setContextMenu(null);
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
        onAddClick={handleAddClick}
        placeholder={translations['search_scripts_placeholder']}
        showBorder={groups}
        disabled={executingScriptId}
      />

      {hasBookmarklets && hasSearchResults && (
        <ScrollView disabled={executingScriptId}>
          {(scrollToElement) => {
            return (
              <List
                ref={{
                  selectedItem: onListItemRefChange.bind(null, scrollToElement)
                }}
                initialSelectedItem={initialSelectedItem}
                disableKeyboardNavigation={contextMenu || executingScriptId}
                disabled={executingScriptId}
                loading={executingScriptId}
                items={results}
                groups={groups}
                placeholder="Untitled script"
                onItemAction={handleListItemAction}
                onItemContextMenu={handleListItemContextMenu}
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

      <Suspense fallback={<div />}>
        <ToastArea />
      </Suspense>

      {contextMenu && (
        <Suspense fallback={<div />}>
          <ContextMenu
            position={contextMenu.position}
            items={contextMenuItems}
            onDismiss={handleContextMenuDismiss}
          />
        </Suspense>
      )}
    </div>
  );
}
