import { createSelector } from 'reselect';

const selectBookmarklets = (state) => state.bookmarklets.all;
const selectRecent = (state) => state.bookmarklets.recent;

export const selectBookmarkletsWithGroup = createSelector(
  selectBookmarklets,
  selectRecent,
  (bookmarklets, recent) => {
    return bookmarklets.map((bookmarklet) => {
      const groupIndex = recent.indexOf(bookmarklet.id);
      const group = groupIndex !== -1 ? 'recent' : null;

      return {
        ...bookmarklet,
        group,
        groupIndex
      };
    });
  }
);
