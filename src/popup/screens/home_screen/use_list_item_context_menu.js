import { useDispatch, useSelector } from 'react-redux';
import {
  addRecentBookmarklet,
  removeRecentBookmarklet
} from '../../store/actions/bookmarklets';
import { selectTranslations } from '../../store/selectors/locale';
import { selectBookmarkletsWithGroup } from '../../store/selectors/bookmarklets';
import { MAX_RECENTS_LENGTH } from '../../store/reducers/bookmarklets';

export function useListItemContextMenu(contextMenu = null) {
  const dispatch = useDispatch();
  const translations = useSelector(selectTranslations);
  const bookmarklets = useSelector(selectBookmarkletsWithGroup);

  if (!contextMenu) {
    return;
  }

  const handleContextMenuEdit = () => {
    window.location.hash = `edit/${contextMenu.item.id}`;
  };

  const handleContextMenuDelete = () => {
    const shouldRemove = confirm(translations['remove_script_confirmation']);

    if (shouldRemove) {
      chrome.bookmarks.remove(contextMenu.item.id, () => {
        setInitialSelectedItem(contextMenu.index - 1);
      });
    }
  };

  const items = [];

  items.push({
    key: 'edit',
    title: translations['edit_label'],
    action: handleContextMenuEdit
  });

  if (
    contextMenu &&
    contextMenu.item &&
    bookmarklets.length > MAX_RECENTS_LENGTH
  ) {
    if (contextMenu.item.group === 'recent') {
      items.push({
        key: 'move-to-other',
        title: translations['move_to_group_label'].replace(
          '%s',
          translations['other_scripts_heading']
        ),
        action: () => {
          dispatch(removeRecentBookmarklet(contextMenu.item.id));
        }
      });
    } else {
      items.push({
        key: 'move-to-recents',
        title: translations['move_to_group_label'].replace(
          '%s',
          translations['recently_used_heading']
        ),
        action: () => {
          dispatch(addRecentBookmarklet(contextMenu.item.id));
        }
      });
    }
  }

  items.push({
    key: 'delete',
    title: translations['remove_button'],
    type: 'danger',
    action: handleContextMenuDelete
  });

  return items;
}
