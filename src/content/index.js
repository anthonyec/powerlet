import { createShadowDomInside } from './create_shadow_dom_inside';

import addIcon from './add_icon.svg';

const POWERLET_BUTTON = "powerlet-button"
const MANAGE_BUTTON = "manage-button"
const LABEL_ID = "add-remove-button__label"

const scripts = document.body.querySelectorAll('[href*="javascript:"]');

Array.from(scripts).forEach((script) => {
  const title = script.textContent;
  const shadow = createShadowDomInside(script);
  const style = document.createElement('style');

  const powerletButton = document.createElement('button');
  const powerletIcon = document.createElement('img');
  const button = document.createElement('button');
  const icon = document.createElement('img');
  const label = document.createElement('span');

  powerletButton.classList.add(POWERLET_BUTTON);

  button.classList.add(MANAGE_BUTTON);

  label.classList.add(LABEL_ID);
  label.textContent = "Add Bookmarklet";

  powerletIcon.src = addIcon;
  icon.src = addIcon;

  style.innerHTML = `
    .${POWERLET_BUTTON} {
      background-image: linear-gradient(-30deg, #D86299 0%, #A449D6 100%);
      border-radius: 100px;
      border: none;
      cursor: pointer;
      display: flex;
      width: 19px;
      height: 19px;
      align-items: center;
      justify-content: center;
      position: absolute;
      transform: translateY(-100%);
    }

    .${POWERLET_BUTTON}:hover ~ .${MANAGE_BUTTON} {
      visibility: visible;
    }

    .${MANAGE_BUTTON} {
      color: white;
      background-image: linear-gradient(-30deg, #D86299 0%, #A449D6 100%);
      border-radius: 13.5px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 5px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-size: 15px;
      font-weight: 500;
      position: absolute;
      transform: translateY(-100%);
      top: 0;
      left: 0;
      gap: 5px;
      visibility: hidden;
    }

    .${MANAGE_BUTTON}:hover {
      visibility: visible;
    }

    .${MANAGE_BUTTON} img {
      flex-shrink: 0;
    }

    .${LABEL_ID} {
      margin-right: 4px;
      white-space: nowrap;
    }
  `;

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    chrome.runtime.sendMessage({ action: "create_bookmark", payload: {
      title,
      url: script.getAttribute('href'),
    }});
  });

  powerletButton.append(powerletIcon);

  button.append(icon);
  button.append(label);

  shadow.appendChild(style);
  shadow.appendChild(powerletButton);
  shadow.appendChild(button);
});

