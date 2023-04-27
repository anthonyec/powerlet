import { createSelector } from 'reselect';

import { selectTranslations } from './locale';
import { MAX_RECENTS_LENGTH } from '../reducers/bookmarklets';
import { fuzzyMatchArray } from '../../lib/fuzzy_match';

const selectBookmarklets = (state) => state.bookmarklets.all;

export const selectRecents = (state) => state.bookmarklets.recent;

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

export const selectBookmarkletGroups = createSelector(
  selectTranslations,
  selectBookmarklets,
  selectRecents,
  (translations, bookmarklets, recents) => {
    // Only show group headings if you have a decent amount of bookmarklets,
    // otherwise it looks a bit silly when 2 bookmarklets are split into groups.
    if (bookmarklets.length > MAX_RECENTS_LENGTH && recents.length !== 0) {
      return [
        { id: 'recent', title: translations['recently_used_heading'] || '' },
        { id: null, title: translations['other_scripts_heading'] || '' }
      ];
    }
  }
);

export const selectShouldCloseWindowAfterExecutingScript = (id = null) => {
  return createSelector(selectRecents, (recents) => {
    return recents[recents.length - 1] === id;
  });
};
