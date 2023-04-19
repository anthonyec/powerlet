import createIconRenderer from './icon_renderer';

const renderIcon = createIconRenderer();

setInterval(renderIcon, 1000);
renderIcon();

chrome.runtime.onMessage.addListener((message) => {
  chrome.bookmarks.create({
    title: message.payload.title,
    url: message.payload.url
  });
});
