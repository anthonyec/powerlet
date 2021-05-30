import { createSelector } from 'reselect';

import { fuzzyMatchArray } from '../../lib/fuzzy_match';

const selectBookmarklets = (state) => state.bookmarklets.all;

const selectRecents = (state) => state.bookmarklets.recent;

const sortResultsByGroup = (results) => {
  return [...results].sort((a, b) => {
    if (
      (a.group === 'recent' && !b.group) ||
      (!a.group && b.group === 'recent')
    ) {
      return a.group === 'recent' ? -1 : 1;
    }

    if (a.group === 'recent' && b.group === 'recent') {
      return b.groupIndex - a.groupIndex;
    }
  });
};

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

export const selectResultsFromBookmarkletsSearch = (query = '') => {
  return createSelector(selectBookmarkletsWithGroup, (bookmarklets) => {
    const results = query
      ? fuzzyMatchArray(bookmarklets, 'title', query)
      : bookmarklets;

    return sortResultsByGroup(results);
  });
};
