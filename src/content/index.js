import { createShadowDom } from './create_shadow_dom';
import addIcon from './add_icon.svg';

const ADD_REMOVE_BUTTON_ID = "powerlet-add-remove-button"

const shadow = createShadowDom();
const scripts = document.querySelectorAll('[href*="javascript:"]');

const style = document.createElement('style');

style.innerHTML = `
  #${ADD_REMOVE_BUTTON_ID} {
    color: white;
    background-image: linear-gradient(-30deg, #D86299 0%, #A449D6 100%);
    border-radius: 13.5px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 5px 10px;
    padding-right: 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 15px;
    font-weight: 500;
    position: absolute;
    top: 10px;
    left: 10px;
    gap: 5px;
  }
`;

const button = document.createElement("button");
const icon = document.createElement('img');

icon.src = addIcon;

button.id = ADD_REMOVE_BUTTON_ID;
button.textContent = "Add Bookmarklet";

button.prepend(icon);
shadow.appendChild(style);
shadow.appendChild(button);

// Array.from(scripts).forEach((script) => {
//   const href = script.getAttribute('href');

//   script.addEventListener('mouseenter', () => {
//     const existingAddRemoveButton = document.getElementById(ADD_REMOVE_BUTTON_ID);

//     if (existingAddRemoveButton) {
//       document.body.removeChild(existingAddRemoveButton);
//     }

//     const rect = script.getBoundingClientRect();
//     const button = document.createElement("button");

//     button.id = ADD_REMOVE_BUTTON_ID;
//     button.style.border = "none";
//     button.style.background = "#D86299"
//     button.style.borderRadius = "8px";
//     button.style.fontFamily = "sans-serif";
//     button.style.padding = "2px 4px";
//     button.style.margin = "0";
//     button.style.color = "white";
//     button.style.left = `${rect.x + rect.width}px`;
//     button.style.top = `${rect.y - rect.height}px`;
//     button.style.position = "fixed";
//     button.textContent = "+ Add to Powerlet"

//     shadow.appendChild(button);
//   });
// });

