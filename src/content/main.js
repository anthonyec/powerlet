const QUEUED_BOOKMARKLET_KEY = '_powerlet_queued_bookmarklet';

function isObject(value) {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

function isFunction(value) {
  return typeof value === 'function';
}

function getPowerletFunction(name, id) {
  const powerletFunction = window[`_powerlet_${name}_${id}`];
  if (!isFunction(powerletFunction)) return null;

  return powerletFunction;
}

function getPowerletBookmarkletFunction(id) {
  return getPowerletFunction('bookmarklet', id);
}

function getPowerletHashFunction(id) {
  return getPowerletFunction('get_hash', id);
}

function queueBookmarkletAndReload(id) {
  window.localStorage.setItem(QUEUED_BOOKMARKLET_KEY, id);
  window.location.reload();
}

function executeBookmarklet(id, currentHash, retry = true) {
  const bookmarklet = getPowerletBookmarkletFunction(id);

  if (retry && !bookmarklet) {
    return queueBookmarkletAndReload();
  }

  const getHash = getPowerletHashFunction(id);
  const existingHash = getHash && getHash();
  const isHashDifferent = existingHash && existingHash !== currentHash;

  if (retry && isHashDifferent) {
    return queueBookmarkletAndReload(id);
  }

  try {
    bookmarklet();
  } catch (err) {
    alert('Failed to run bookmarklet:\n', err);
  }
}

window.addEventListener('load', () => {
  const queuedBookmarkletId = JSON.parse(
    window.localStorage.getItem(QUEUED_BOOKMARKLET_KEY)
  );
  window.localStorage.removeItem(QUEUED_BOOKMARKLET_KEY); // TODO(anthony): Replace with chrome.storage API or in background in-memory value? Seems broken.
  console.log(QUEUED_BOOKMARKLET_KEY, { queuedBookmarkletId });

  if (queuedBookmarkletId) {
    const bookmarklet = getPowerletBookmarkletFunction(queuedBookmarkletId);
    if (!bookmarklet) return;

    executeBookmarklet(queuedBookmarkletId, false);
  }
});

window.addEventListener('powerlet-event', (event) => {
  if (!isObject(event)) return;
  if (!('type' in event) || event.type !== 'powerlet-event') return;
  if (!('type' in event.detail)) return;

  if (event.detail.type === 'execute-bookmarklet') {
    executeBookmarklet(event.detail.id, event.detail.hash);
  }
});
