import { useEffect } from 'react';
import { cyrb53 } from '../../utils/cyrb53';

function joinLines(...lines) {
  let text = '';

  for (const line of lines) {
    text += line + '\n';
  }

  return text;
}

async function getBookmarklets() {
  const bookmarks = await chrome.bookmarks.search({
    // Use query because it's a fuzzy search. Searching by URL would
    // only return exact matches.
    query: 'javascript:'
  });

  return bookmarks.filter((bookmarklet) => {
    return bookmarklet.url && bookmarklet.url.match(/^javascript\:/);
  });
}

function getBookmarkletUserScriptId(bookmarklet) {
  return `powerlet_bookmarklet_${bookmarklet.id}`;
}

function getBookmarkletUserScriptCode(bookmarklet) {
  let bookmarkletCode;

  try {
    bookmarkletCode = decodeURIComponent(bookmarklet.url);
  } catch (err) {
    bookmarkletCode = bookmarklet.url;
  }

  bookmarkletCode = bookmarkletCode.trim();
  if (!bookmarkletCode) return '';

  const id = getBookmarkletUserScriptId(bookmarklet);

  // Original bookmarklet URL is used instead of decoded URI/trimmed code
  // because the hash needs to be compared elsewhere, where we don't have access
  // to the full generated code. E.g `actions/bookmarklets.js`
  const hash = cyrb53(bookmarklet.url);

  return joinLines(
    `typeof window._powerlet_register_bookmarklet === "function" && window._powerlet_register_bookmarklet("${bookmarklet.id}", "${hash}");`,
    `function _${id}() {`,
    `  // ${bookmarklet.title}`,
    `  ${bookmarkletCode}`,
    '}'
  );
}

async function registerBookmarkletAsUserScript(bookmarklet) {
  const id = getBookmarkletUserScriptId(bookmarklet);
  const code = getBookmarkletUserScriptCode(bookmarklet);

  return chrome.userScripts.register([
    {
      id,
      matches: ['*://*/*'],
      js: [{ code }],
      runAt: 'document_start',
      world: 'MAIN'
    }
  ]);
}

async function updateBookmarkletAsUserScript(bookmarklet) {
  const id = getBookmarkletUserScriptId(bookmarklet);
  const code = getBookmarkletUserScriptCode(bookmarklet);

  return chrome.userScripts.update([
    {
      id,
      js: [{ code }]
    }
  ]);
}

export function useUserScripts() {
  useEffect(() => {
    async function registerUserScripts() {
      const bookmarklets = await getBookmarklets();

      for (const bookmarklet of bookmarklets) {
        const id = getBookmarkletUserScriptId(bookmarklet);
        const [existingUserScript] = await chrome.userScripts.getScripts({
          ids: [id]
        });

        if (!existingUserScript) {
          await registerBookmarkletAsUserScript(bookmarklet);
          continue;
        }

        const existingCode = existingUserScript.js[0].code;
        const bookmarkletCode = getBookmarkletUserScriptCode(bookmarklet);

        if (existingCode !== bookmarkletCode) {
          await updateBookmarkletAsUserScript(bookmarklet);
          continue;
        }
      }
    }

    registerUserScripts();
  }, []);
}
