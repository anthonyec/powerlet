import * as identifiers from '../identifiers';
import { cyrb53 } from '../utils/cyrb53';
import { isObject } from '../utils/is_object';
import { joinLines } from '../utils/join_lines';

async function waitForContentScriptReady() {}

function parseBoolean(value) {
  if (!value) return true;
  if (value === 'yes' || value === '1' || value === 'true') return true;
  return false;
}

function parseWindowFeatures(windowFeatures = '') {
  const params = {};
  const pairs = windowFeatures.split(',');

  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    const numericValue = parseInt(value);
    params[key] = isNaN(numericValue) ? parseBoolean(value) : numericValue;
  }

  return params;
}

async function invokeProxyFunction(name, args = []) {
  console.log('invokeProxyFunction');

  switch (name) {
    case 'open': {
      const [url = '', _target = '', windowFeatures = ''] = args;

      if (
        windowFeatures.includes('width') ||
        windowFeatures.includes('height')
      ) {
        const params = parseWindowFeatures(windowFeatures);
        const left = params['left'] || params['screenX'];
        const top = params['top'] || params['screenY'];
        const width = params['width'] || params['innerWidth'];
        const height = params['height'] || params['innerHeight'];
        const type = params['toolbar'] === 'no' ? 'popup' : 'normal';

        // TODO(anthony): Parse arguments and convert them to create options.
        chrome.windows.create({
          url,
          type,
          left,
          top,
          width,
          height,
          setSelfAsOpener: true
        });
      } else {
        // TODO(anthony): Ensure tab is created after the last active tab.
        chrome.tabs.create({ url });
      }
      break;
    }
    default:
      console.error(`No proxy function found for: ${name}`);
  }
}

async function queueAndReload(bookmarkId) {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });
  if (!activeTab) return;

  await chrome.tabs.reload(activeTab.id);
  await executeBookmarklet(bookmarkId, false);
}

async function executeBookmarklet(bookmarkId, retry = true) {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });
  if (!activeTab) return console.error('No active tab found');

  const [bookmark] = await chrome.bookmarks.get(bookmarkId);
  if (!bookmark) return console.error('No bookmark found');

  const hash = cyrb53(bookmark.url);

  try {
    await chrome.tabs.sendMessage(activeTab.id, {
      type: identifiers.executeBookmarkletEvent,
      id: bookmarkId,
      hash
    });
  } catch (err) {
    console.error(
      retry
        ? 'Failed to execute bookmarklet, retrying...'
        : 'Failed to execute bookmarklet',
      err
    );

    if (retry) {
      queueAndReload(bookmarkId);
    }
  }
}

async function getBookmarklets() {
  const bookmarks = await chrome.bookmarks.search({
    // Use query because it's a fuzzy search. Searching by URL would
    // only return exact matches.
    query: 'javascript:'
  });

  return bookmarks.filter((bookmark) => {
    return bookmark.url && bookmark.url.match(/^javascript\:/);
  });
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

  // Original bookmarklet URL is used instead of decoded URI/trimmed code
  // because the hash needs to be compared elsewhere, where we don't have access
  // to the full generated code. E.g `actions/bookmarklets.js`
  const hash = cyrb53(url);

  const code = joinLines(
    `function _powerlet_get_hash_${id}() {`,
    `  return "${hash}";`,
    `}`,
    `function _${userScriptId}() {`,
    `  // ${title}`,
    `  const powerletOpen = (...args) => ${identifiers.invokeProxyFunction}("open", args);`,
    `  const window = { ...globalThis, open: powerletOpen };`,
    `  const open = powerletOpen;`,
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

async function main() {
  // TODO(anthony): Add check here for userScripts support.

  // When restarting the service working, either by reloading or disabling the
  // extension, reload all registered user scripts.
  await chrome.userScripts.unregister();
  await registerAllBookmarklets();

  chrome.bookmarks.onCreated.addListener((id, bookmark) => {
    const userScript = getBookmarkletAsUserScript(
      id,
      bookmark.title,
      bookmark.url
    );

    registerUserScript(userScript);
  });

  chrome.bookmarks.onRemoved.addListener((id) => {
    removeUserScript(id);
  });

  chrome.bookmarks.onChanged.addListener(async (id, bookmark) => {
    const userScript = getBookmarkletAsUserScript(
      id,
      bookmark.title,
      bookmark.url
    );

    updateUserScript(userScript);
  });

  chrome.runtime.onMessage.addListener(async (message) => {
    if (!isObject(message) || !('type' in message)) return;
    console.log('background', message);

    if (message.type === identifiers.executeBookmarkletEvent) {
      executeBookmarklet(message.id);
    }

    if (message.type === identifiers.queueAndReloadEvent) {
      queueAndReload(message.id);
    }

    if (message.type === identifiers.invokeProxyFunction) {
      invokeProxyFunction(message.name, message.args);
    }
  });
}

main();
