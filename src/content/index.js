import { createShadowDomInside } from './create_shadow_dom_inside';
import addIcon from './add_icon.svg';

const BUTTON_ID = "powerlet-add-remove-button"
const LABEL_ID = "powerlet-add-remove-button__label"

const scripts = document.body.querySelectorAll('[href*="javascript:"]');

Array.from(scripts).forEach((script) => {
  const shadow = createShadowDomInside(script);
  const style = document.createElement('style');

  const button = document.createElement('button');
  const icon = document.createElement('img');
  const label = document.createElement('span');

  icon.src = addIcon;

  button.id = BUTTON_ID;
  button.style.position = "relative";

  label.id = LABEL_ID;
  label.textContent = "Add Bookmarklet";

  style.innerHTML = `
    #${BUTTON_ID} {
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
      width: 27px;
      height: 27px;
      transform: translateY(-50%);
      transition: all;
      gap: 5px;
    }

    #${BUTTON_ID} img {
      flex-shrink: 0;
    }

    #${BUTTON_ID}:hover {
      width: min-content;
    }

    #${LABEL_ID} {
      margin-right: 3px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
    }

    #${BUTTON_ID}:hover #${LABEL_ID} {
      opacity: 1;
      visibility: visible;
    }
  `;

  button.append(icon);
  button.append(label);

  shadow.appendChild(style);
  shadow.appendChild(button);
});

