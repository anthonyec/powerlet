export function isBookmarklet(bookmark) {
  return bookmark.url && bookmark.url.match(/^javascript\:/);
}
