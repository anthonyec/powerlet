import { useEffect } from 'react';

function joinLines(...lines) {
  let text = '';

  for (const line of lines) {
    text += line + '\n';
  }

  return text;
}

export function useUserScripts() {
  useEffect(() => {
    async function registerUserScripts() {
      chrome.userScripts.unregister();

      const results = await chrome.bookmarks.search({
        // Use query because it's a fuzzy search. Searching by URL would
        // only return exact matches.
        query: 'javascript:'
      });

      for (let index = 0; index < results.length - 1; index++) {
        if (index >= 1024) break;

        const script = results[index];
        if (!script) continue;
        if (!script.url || !script.url.match(/^javascript\:/)) continue;

        const id = `powerlet_bookmarklet_${script.id}`;

        let bookmarkletCode;

        try {
          bookmarkletCode = decodeURIComponent(script.url);
        } catch (err) {
          bookmarkletCode = script.url;
        }

        bookmarkletCode = bookmarkletCode.trim();
        if (!bookmarkletCode) continue;

        const code = joinLines(
          `typeof _powerlet_bookmarklet_loaded === "function" && _powerlet_bookmarklet_loaded(${script.id});`,
          `function _${id}() {`,
          `  // ${script.title}`,
          `  ${bookmarkletCode}`,
          '}'
        );

        chrome.userScripts.register([
          {
            id,
            matches: ['*://*/*'],
            js: [{ code }],
            runAt: 'document_start',
            world: 'MAIN'
          }
        ]);
      }
    }

    registerUserScripts();
  }, []);
}
