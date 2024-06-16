import * as identifiers from '../identifiers';
import { createBrowserLocalStorage } from '../utils/browser_local_storage';
import { cyrb53 } from '../utils/cyrb53';
import { isBookmarklet } from '../utils/is_bookmarklet';
import { isMessage } from '../utils/is_message';
import { joinLines } from '../utils/join_lines';
import { createLogger } from '../utils/logger';
import { supportsUserScripts } from '../utils/supports_user_scripts';

const logger = createLogger('background');

async function reloadTab(tabId) {
  return new Promise((resolve) => {
    const handleTabUpdated = (updatedTabId, changeInfo) => {
      if (updatedTabId !== tabId) return;

      if (changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(handleTabUpdated);
        resolve();
      }
    };

    chrome.tabs.onUpdated.addListener(handleTabUpdated);
    chrome.tabs.reload(tabId);
  });
}

async function queueAndReload(bookmarkId, tabId) {
  logger.log('queue_and_reload:start');
  await reloadTab(tabId);
  logger.log('queue_and_reload:finished_reload');
  await executeBookmarklet(bookmarkId, tabId, false);
  logger.log('queue_and_reload:finished_execute');
}

async function executeBookmarklet(bookmarkId, tabId, retry = true) {
  const [bookmark] = await chrome.bookmarks.get(bookmarkId);
  if (!bookmark) return logger.error('No bookmark found');

  const hash = cyrb53(bookmark.url);

  const storage = createBrowserLocalStorage(`settings_local:${bookmarkId}`, {
    allowPopups: true
  });
  const settings = await storage.getAll().catch(logger.error);

  try {
    // Send message to isolated content script in active tab.
    logger.log('Send message to tab');

    await chrome.tabs.sendMessage(tabId, {
      type: identifiers.executeBookmarkletEvent,
      bookmarkId,
      tabId,
      hash,
      retry,
      settings
    });
  } catch (err) {
    logger.error('Failed to execute bookmarklet', err);

    if (retry) {
      await queueAndReload(bookmarkId, tabId);
    }
  }
}

async function getBookmarklets() {
  const bookmarks = await chrome.bookmarks.search({
    // Use query because it's a fuzzy search. Searching by URL would
    // only return exact matches.
    query: 'javascript:'
  });

  return bookmarks.filter(isBookmarklet);
}

function getUserScriptId(bookmarkId) {
  return `powerlet_bookmarklet_${bookmarkId}`;
}

function getBookmarkletAsUserScript(id, title, url = '') {
  const userScriptId = getUserScriptId(id);

  let bookmarkletCode = '';

  try {
    bookmarkletCode = decodeURIComponent(url);
  } catch (err) {
    bookmarkletCode = url;
  }

  bookmarkletCode = bookmarkletCode.trim();

  if (bookmarkletCode === 'javascript:') {
    bookmarkletCode = '// javascript:';
  }

  // Original bookmarklet URL is used instead of decoded URI/trimmed code
  // because the hash needs to be compared elsewhere, where we don't have access
  // to the full generated code. E.g `actions/bookmarklets.js`
  const hash = cyrb53(url);

  const code = joinLines(
    `function _powerlet_get_hash_${id}() {`,
    `  return "${hash}";`,
    `}`,
    `function _${userScriptId}(settings = {}) {`,
    `  // ${title}`,
    `  const proxyOpen = (...args) => ${identifiers.invokeProxyFunction}("open", args);`,
    `  const handler = {`,
    `    get: function(target, property, receiver) {`,
    `      let targetObj = target[property];`,
    `      if (typeof targetObj == "function") {`,
    `        if (property === "open") {`,
    `          return (...args) => proxyOpen(...args);`,
    `        }`,
    `        return (...args) => target[property].apply(target, args)`,
    `      } else {`,
    `        return targetObj;`,
    `      }`,
    `    }`,
    `  };`,
    `  const proxyWindow = new Proxy(globalThis, handler);`,
    ``,
    `  const open = settings.allowPopups ? proxyOpen : globalThis.open;`,
    `  const window = settings.allowPopups ? proxyWindow : globalThis;`,
    `  ${bookmarkletCode}`,
    '}'
  );

  return { id: userScriptId, code };
}

async function registerUserScript(userScript) {
  return chrome.userScripts.register([
    {
      id: userScript.id,
      matches: ['*://*/*'],
      js: [{ code: userScript.code }],
      runAt: 'document_start',
      world: 'MAIN'
    }
  ]);
}

async function updateUserScript(userScript) {
  return chrome.userScripts.update([
    {
      id: userScript.id,
      js: [{ code: userScript.code }]
    }
  ]);
}

async function removeUserScript(bookmarkId) {
  return chrome.userScripts.unregister({ ids: [getUserScriptId(bookmarkId)] });
}

async function hasUserScript(bookmarkId) {
  const userScripts = await chrome.userScripts.getScripts({
    ids: [getUserScriptId(bookmarkId)]
  });

  return userScripts.length > 0;
}

async function registerAllBookmarklets() {
  const bookmarklets = await getBookmarklets();

  for (const bookmarklet of bookmarklets) {
    const userScript = getBookmarkletAsUserScript(
      bookmarklet.id,
      bookmarklet.title,
      bookmarklet.url
    );

    await registerUserScript(userScript);
  }
}

async function reloadAllUserScripts() {
  // When restarting the service working, either by reloading or disabling the
  // extension, reload all registered user scripts.
  await chrome.userScripts.unregister();
  await registerAllBookmarklets();
}

// TODO(anthony): Add check here for userScripts support.

chrome.runtime.onInstalled.addListener(async () => {
  if (!supportsUserScripts()) return;

  await reloadAllUserScripts();
});

chrome.bookmarks.onCreated.addListener(async (id, bookmark) => {
  if (!supportsUserScripts()) return;
  if (!isBookmarklet(bookmark)) return;

  const userScript = getBookmarkletAsUserScript(
    id,
    bookmark.title,
    bookmark.url
  );

  await registerUserScript(userScript);
});

chrome.bookmarks.onRemoved.addListener(async (id, removeInfo) => {
  if (!supportsUserScripts()) return;
  if (!isBookmarklet(removeInfo.node)) return;

  await removeUserScript(id);
});

chrome.bookmarks.onChanged.addListener(async (id, updateInfo) => {
  if (!supportsUserScripts()) return;

  const wasUserScript = await hasUserScript(id);

  if (!isBookmarklet(updateInfo)) {
    if (wasUserScript) {
      logger.log('converted userScript to bookmark', id);
      await removeUserScript(id);
    }

    return;
  }

  if (!wasUserScript) {
    logger.log('converted bookmark to userScript', id);

    const userScript = getBookmarkletAsUserScript(
      id,
      updateInfo.title,
      updateInfo.url
    );

    await registerUserScript(userScript);
    return;
  }

  const userScript = getBookmarkletAsUserScript(
    id,
    updateInfo.title,
    updateInfo.url
  );

  logger.log('update', userScript);
  await updateUserScript(userScript);
});

const environmentStorage = createBrowserLocalStorage('environment', {
  supportsUserScripts: false
});

chrome.runtime.onMessage.addListener(async (message, _sender, respond) => {
  if (!isMessage(message)) return;

  logger.log('on_runtime_message', message);

  const isUserScriptsEnabled = supportsUserScripts();

  if (message.type === identifiers.pingEvent) {
    respond({ type: identifiers.pongEvent });

    const wasUserScriptsEnabled = await environmentStorage.get(
      'supportsUserScripts'
    );

    if (!wasUserScriptsEnabled && isUserScriptsEnabled) {
      reloadAllUserScripts();
    }
  }

  // Any event handlers after this require user script support. If it's not
  // supported, don't handle those events.
  await environmentStorage.set('supportsUserScripts', isUserScriptsEnabled);
  if (!isUserScriptsEnabled) return;

  if (message.type === identifiers.executeBookmarkletEvent) {
    executeBookmarklet(message.bookmarkId, message.tabId);
  }

  if (message.type === identifiers.queueAndReloadEvent) {
    queueAndReload(message.bookmarkId, message.tabId);
  }
});
