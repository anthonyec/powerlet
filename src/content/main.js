const idToHash = new Map();

function isObject(value) {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

function isFunction(value) {
  return typeof value === 'function';
}

function executeBookmarklet(id, hash) {
  const bookmarklet = window[`_powerlet_bookmarklet_${id}`];

  const existingHash = idToHash.get(id);
  console.log(id, hash, idToHash.get(id));

  if (!isFunction(bookmarklet) || (existingHash && existingHash !== hash)) {
    window.localStorage.setItem('_powerlet_queued_bookmarklet', id);
    window.location.reload();
    return;
  }

  try {
    bookmarklet();
  } catch (err) {
    alert('Failed to run bookmarklet:\n' + err);
  }
}

window._powerlet_register_bookmarklet = (id = '', hash = '') => {
  console.log('_powerlet_register_bookmarklet', id, hash);
  if (!id || !hash) return;
  idToHash.set(id, hash);
};

window.addEventListener('load', () => {
  console.log('LOADED');
  console.log(idToHash);
  // const queuedBookmarkletId = window.localStorage.getItem(
  //   '_powerlet_queued_bookmarklet'
  // );
  // window.localStorage.removeItem('_powerlet_queued_bookmarklet');
  // if (queuedBookmarkletId) {
  //   const bookmarklet = window[`_powerlet_bookmarklet_${queuedBookmarkletId}`];
  //   if (!isFunction(bookmarklet)) return;
  //   executeBookmarklet(queuedBookmarkletId);
  // }
});

window.addEventListener('powerlet-event', (event) => {
  if (!isObject(event)) return;
  if (!('type' in event) || event.type !== 'powerlet-event') return;
  if (!('type' in event.detail)) return;

  if (event.detail.type === 'execute-bookmarklet') {
    executeBookmarklet(event.detail.id, event.detail.hash);
  }
});
