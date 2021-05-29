export default function useSortByRecent(results = []) {
  // This avoids mutating the original results array, causing sorting to affect
  // the fuzzy results outside of this hook.
  // TODO: Find a way to do this nicely. Immutable library for arrays?
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
}
