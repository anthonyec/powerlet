import { createSelector } from 'reselect';

const selectBookmarklets = (state) => state.bookmarklets.all;

const selectRecents = (state) => state.bookmarklets.recent;

export const selectBookmarkletsWithGroup = createSelector(
  selectBookmarklets,
  selectRecents,
  (bookmarklets, recents) => {
    return bookmarklets.map((bookmarklet) => {
      const groupIndex = recents.indexOf(bookmarklet.id);
      const group = groupIndex !== -1 ? 'recent' : null;

      return {
        ...bookmarklet,
        group,
        groupIndex
      };
    });
  }
);
