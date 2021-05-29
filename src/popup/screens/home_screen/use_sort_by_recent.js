export default function useSortByRecent(results = []) {
  return results.sort((a, b) => {
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
