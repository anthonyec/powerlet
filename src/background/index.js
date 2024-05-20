import { cyrb53 } from '../utils/cyrb53';
import { joinLines } from '../utils/joinLines';

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
    `  console.log("_powerlet_get_hash_", ${id});`,
    `  return "${hash}";`,
    `}`,
    `function _${userScriptId}() {`,
    `  // ${title}`,
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
}

main();
