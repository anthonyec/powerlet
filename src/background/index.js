import { CREATE_BOOKMARK } from '../content/show_button_inside_element';
import createIconRenderer from './icon_renderer';

const renderIcon = createIconRenderer();

setInterval(renderIcon, 1000);
renderIcon();

chrome.runtime.onMessage.addListener(
  (message = { action: null, payload: null }) => {
    if (message.action === CREATE_BOOKMARK) {
      chrome.bookmarks.create({
        title: message.payload.title,
        url: message.payload.url
      });
    }
  }
);
