import { createShadowDomInside } from './create_shadow_dom_inside';

import addIcon from './add_icon.svg';
import checkIcon from './check_icon.svg';

const CONTAINER_CLASS_NAME = 'powerlet-button';
const MANAGE_BUTTON_CLASS_NAME = 'manage-button';
const LABEL_CLASS_NAME = 'add-remove-button__label';

const scripts = document.body.querySelectorAll('[href*="javascript:"]');

Array.from(scripts).forEach((script) => {
  const title = script.textContent;
  const href = script.getAttribute('href');

  if (href.trim().replaceAll(/\s/g, '') === 'javascript:void(0)') {
    return;
  }

  if (title.trim() === '') {
    return;
  }

  const shadow = createShadowDomInside(script);
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

    .${LABEL_CLASS_NAME} {
      margin-right: 4px;
      white-space: nowrap;
      display: none;
      user-select: none;
      pointer-events: none;
    }

    @keyframes added {
      from {
        box-shadow: 0 0 0 rgba(0, 255, 0, 1);
      }

      to {
        box-shadow: 0 0 50px rgba(0, 255, 0, 0);
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
          url: href
        }
      });
    } catch (error) {
      alert(
        'Powerlet: Something went wrong when adding bookmarklet. Please reload the page and try again.'
      );
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
});
