import { createShadowDomInside } from './create_shadow_dom_inside';

import addIcon from './add_icon.svg';
import checkIcon from './check_icon.svg';

const CONTAINER_CLASS_NAME = 'powerlet-button';
const MANAGE_BUTTON_CLASS_NAME = 'manage-button';
const LABEL_CLASS_NAME = 'add-remove-button__label';

const scripts = document.body.querySelectorAll('[href*="javascript:"]');

function showButtonInside(target, title, code) {
  const shadow = createShadowDomInside(target);
  const style = document.createElement('style');

  const container = document.createElement('div');
  const button = document.createElement('button');
  const icon = document.createElement('img');
  const label = document.createElement('span');

  container.classList.add(CONTAINER_CLASS_NAME);
  button.classList.add(MANAGE_BUTTON_CLASS_NAME);

  label.classList.add(LABEL_CLASS_NAME);
  label.textContent = 'Add Bookmarklet';

  icon.src = addIcon;

  style.innerHTML = `
    .${CONTAINER_CLASS_NAME} {
      width: 28px;
      height: 28px;
      position: absolute;
      transform: translate(-30%, -100%);
      top: 50%;
      left: 50%;
    }

    .${CONTAINER_CLASS_NAME}:hover .${MANAGE_BUTTON_CLASS_NAME} {
      padding: 5px;
      width: auto;
      height: auto;
      transform: translate(-12.5px, -50%);
    }

    .${CONTAINER_CLASS_NAME}:hover .${LABEL_CLASS_NAME} {
      display: block;
    }

    .${MANAGE_BUTTON_CLASS_NAME} {
      color: white;
      background-image: linear-gradient(-30deg, #D86299 0%, #A449D6 100%);
      border-radius: 100px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-size: 15px;
      font-weight: 500;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-9px, -50%);
      gap: 5px;
      width: 19px;
      height: 19px;
    }

    .${MANAGE_BUTTON_CLASS_NAME}--added {
      background: green;
      animation: added 600ms ease;
    }

    .${MANAGE_BUTTON_CLASS_NAME} img {
      flex-shrink: 0;
      user-select: none;
      pointer-events: none;
    }

    .${MANAGE_BUTTON_CLASS_NAME}--added img {
      transform: translateY(1px);
    }

    .${LABEL_CLASS_NAME} {
      margin-right: 4px;
      white-space: nowrap;
      display: none;
      user-select: none;
      pointer-events: none;
    }

    @keyframes added {
      from {
        box-shadow: 0 0 0 rgba(0, 100, 0, 1);
      }

      to {
        box-shadow: 0 0 50px rgba(0, 100, 0, 0);
      }
    }
  `;

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      chrome.runtime.sendMessage({
        action: 'create_bookmark',
        payload: {
          title: title.trim(),
          url: code.trim()
        }
      });
    } catch (error) {
      alert(
        'Powerlet: Something went wrong when adding bookmarklet. Please reload the page and try again.'
      );
      console.error(error);
      return;
    }

    label.textContent = 'Added!';
    button.classList.add(`${MANAGE_BUTTON_CLASS_NAME}--added`);
    icon.src = checkIcon;
  });

  button.append(icon);
  button.append(label);
  container.append(button);

  shadow.appendChild(style);
  shadow.appendChild(container);
}

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

  showButtonInside(script, title, href);
});
