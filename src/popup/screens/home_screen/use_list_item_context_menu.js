import { useDispatch, useSelector } from 'react-redux';
import { useBrowserBookmarks } from '../../hooks/use_browser_bookmarks';
import { useUserScripts } from '../../hooks/use_user_scripts';
import {
  addRecentBookmarklet,
  removeRecentBookmarklet
} from '../../store/actions/bookmarklets';
import { MAX_RECENTS_LENGTH } from '../../store/reducers/bookmarklets';
import { selectBookmarkletsWithGroup } from '../../store/selectors/bookmarklets';
import { selectTranslations } from '../../store/selectors/locale';

export function useListItemContextMenu(
  contextMenu = null,
  onDelete = () => {}
) {
  const dispatch = useDispatch();
  const translations = useSelector(selectTranslations);
  const bookmarklets = useSelector(selectBookmarkletsWithGroup);
  const bookmarks = useBrowserBookmarks();

  useUserScripts();

  if (!contextMenu) {
    return;
  }

  const handleContextMenuEdit = () => {
    window.location.hash = `edit/${contextMenu.item.id}`;
  };

  const handleContextMenuDelete = async () => {
    await bookmarks.remove(contextMenu.item);
    onDelete();
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
