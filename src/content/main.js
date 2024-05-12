function isObject(value) {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

function isFunction(value) {
  return typeof value === 'function';
}

function executeBookmarklet(id) {
  const bookmarklet = window[`_powerlet_bookmarklet_${id}`];

  if (!isFunction(bookmarklet)) {
    window.localStorage.setItem('_powerlet_queued_bookmarklet', id);
    window.location.reload();
    return;
  }

  window.localStorage.removeItem('_powerlet_queued_bookmarklet');

  try {
    bookmarklet();
  } catch (err) {
    alert('Failed to run bookmarklet:\n' + err);
  }
}

window._powerlet_bookmarklet_loaded = (id) => {
  // console.log('_powerlet_bookmarklet_loaded', id);
};

window.addEventListener('load', () => {
  const queuedBookmarkletId = window.localStorage.getItem(
    '_powerlet_queued_bookmarklet'
  );

  if (queuedBookmarkletId) {
    const bookmarklet = window[`_powerlet_bookmarklet_${queuedBookmarkletId}`];
    if (!isFunction(bookmarklet)) return;

    executeBookmarklet(queuedBookmarkletId);
  }
});

window.addEventListener('powerlet-event', (event) => {
  if (!isObject(event)) return;
  if (!('type' in event) || event.type !== 'powerlet-event') return;
  if (!('type' in event.detail)) return;

  if (event.detail.type === 'execute-bookmarklet') {
    executeBookmarklet(event.detail.id);
  }
});
