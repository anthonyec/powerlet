import { useDispatch, useSelector } from 'react-redux';

import { selectTranslations } from '../store/selectors/locale';
import { selectRecents } from '../store/selectors/bookmarklets';
import {
  addRecentBookmarklet,
  removeRecentBookmarklet
} from '../store/actions/bookmarklets';
import { useToast } from './useToast';
import { useUndoHistory } from './useUndoHistory';

export function useBrowserBookmarks() {
  const dispatch = useDispatch();
  const translations = useSelector(selectTranslations);
  const recents = useSelector(selectRecents);
  const undoHistory = useUndoHistory();
  const toast = useToast();

  const create = (options) => {
    return new Promise((resolve) => {
      chrome.bookmarks.create(options, (result) => {
        // A handle to get a dynamic reference to the bookmark ID. The bookmark
        // ID can potentially change between deleting bookmarks and undoes,
        // causing a "Can't find bookmark for id" error and preventing undo
        // working correctly.
        //
        // Without handles, the following scenario can happen because we can't
        // control what ID is used for creating bookmarks.
        // - User creates a bookmark, Chrome gives it the ID of `1`.
        // - Push onto the undo stack: Delete bookmark with ID `1`.
        // - User deletes bookmark with ID `1`
        // - Push onto the undo stack: Create bookmark
        // - User undoes
        // - Pop the stack and create a bookmark, Chrome gives it the ID of `2`
        // - User undoes
        // - Pop the stack and try delete bookmark with ID `1`
        // - Bookmark with that ID does not exist!
        const handle = undoHistory.createHandle(result.id);

        undoHistory.push(
          () =>
            new Promise((undoResolve) => {
              chrome.bookmarks.remove(handle.value, () => {
                undoHistory.removeHandle(handle);
                undoResolve();
              });
            })
        );

        resolve(result);
      });
    });
  };

  const remove = (bookmark) => {
    return new Promise((resolve) => {
      chrome.bookmarks.remove(bookmark.id, () => {
        const handle = undoHistory.getHandleByValue(bookmark.id);
        const isRecent = recents.includes(bookmark.id);

        if (isRecent) {
          dispatch(removeRecentBookmarklet(bookmark.id));
        }

        undoHistory.push(
          () =>
            new Promise((undoResolve) => {
              chrome.bookmarks.create(
                {
                  parentId: bookmark.parentId,
                  index: bookmark.index,
                  title: bookmark.title,
                  url: bookmark.url
                },
                (result) => {
                  if (handle) {
                    // Update the old ID with the new ID so that when undoing
                    // creation of bookmarks, the correct ID is always available.
                    handle.update(result.id);
                  }

                  if (isRecent) {
                    dispatch(addRecentBookmarklet(result.id));
                  }

                  toast.hide();
                  undoResolve();
                }
              );
            })
        );

        toast.show(
          translations['script_deleted_toast'].replace(
            '%s',
            bookmark.title || 'Untitled script'
          ),
          translations['undo_label'],
          undoHistory.pop
        );

        resolve();
      });
    });
  };

  return {
    create,
    remove
  };
}
