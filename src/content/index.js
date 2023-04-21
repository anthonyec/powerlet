import { showButtonInsideElement } from './show_button_inside_element';

function main() {
  const scripts = document.body.querySelectorAll('[href*="javascript:"]');

  Array.from(scripts).forEach((script) => {
    const title = script.textContent;
    const href = script.getAttribute('href');
    const cleanHref = href.trim().replaceAll(' ', '').replaceAll(';', '');
    const classList = Array.from(script.classList);

    // A lot of random buttons on websites include `void` code to prevent the
    // default behaviour of links. These should not be considered bookmarklets.
    if (cleanHref === 'javascript:void(0)' || cleanHref === 'javascript:') {
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
