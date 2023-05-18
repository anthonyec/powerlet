import { DEFAULT_WINDOW_METHODS } from './default_window_methods';
import { showButtonInsideElement } from './show_button_inside_element';

const FUNCTION_REGEX = /^([a-zA-Z0-9].*)\(.*?\)$/g;

function main() {
  const scripts = document.body.querySelectorAll('[href*="javascript:"]');

  Array.from(scripts).forEach((script) => {
    const title = script.textContent;
    const href = script.getAttribute('href');
    const cleanHref = href.trim().replaceAll(' ', '').replaceAll(';', '');
    const cleanHrefWithoutPrefix = cleanHref.replace(/^javascript:/, '');
    const classList = Array.from(script.classList);

    // A lot of random buttons on websites include `void` code to prevent the
    // default behaviour of links. These should not be considered bookmarklets.
    if (
      cleanHref === 'javascript:' ||
      cleanHref === 'javascript:void(0)' ||
      cleanHref === 'javascript:void0'
    ) {
      return;
    }

    // Empty links are not considered bookmarklets, such as icon buttons.
    if (title.trim() === '') {
      return;
    }

    // A single character, like "x", is something used for buttons. Example on
    // this cookie banner: https://www.universityofgalway.ie/t4training/bookmarklets.html
    if (title.length === 1) {
      return;
    }

    // A regex object is stateful. Not resetting this will cause the regex test
    // to toggle between `true` and `false` on each iteration of the loop, which
    // is bananas!
    FUNCTION_REGEX.lastIndex = 0;

    const match = FUNCTION_REGEX.exec(cleanHrefWithoutPrefix);

    if (match) {
      const potentialFunctionName = match[1].replace(/^window\./g, '');
      const isDefaultWindowMethod = DEFAULT_WINDOW_METHODS.includes(
        potentialFunctionName
      );

      if (!isDefaultWindowMethod) {
        return;
      }
    }

    // To avoid links that are buttons with non-bookmarklet scripts, check the
    // class name for any reference for "button" but without "bookmarklet".
    // Currently this basic heuristic is to avoid highlighting the "Add to Card"
    // and "Add to Wishlist" buttons on the Steam store page. But also keep
    // it working with things like: https://www.addtoany.com/services/pinboard_button
    // which have a button class name but also reference bookmarklet.
    for (const className of classList) {
      const includesButtonWord =
        className.includes('btn') || className.includes('button');
      const includesBookmarkletName = className.includes('bookmarklet');

      if (includesButtonWord && !includesBookmarkletName) {
        return;
      }
    }

    showButtonInsideElement(script, title, href);
  });
}

main();
