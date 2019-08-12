import './api';

const $canvas = document.createElement('canvas');
const ctx = $canvas.getContext('2d');

const WIDTH = 19 * window.devicePixelRatio;
const HEIGHT = 19 * window.devicePixelRatio;

ctx.canvas.width = WIDTH;
ctx.canvas.height = HEIGHT;

function iconRenderer() {
  let lastMatch;

  return () => {
    const img = new Image();
    const match = matchMedia('(prefers-color-scheme: dark)').matches;

    if (match === lastMatch) {
      return;
    }

    img.src = match ? 'default_icon_dark@2x.png' : 'default_icon@2x.png';

    img.onload = () => {
      ctx.drawImage(img, 0, 0);

      chrome.browserAction.setIcon({
        imageData: ctx.getImageData(0, 0, WIDTH, HEIGHT)
      });
    };

    lastMatch = match;
  };
}

const renderIcon = iconRenderer();

setInterval(renderIcon, 1000);
renderIcon();
