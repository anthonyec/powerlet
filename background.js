const $canvas = document.createElement('canvas');
const ctx = $canvas.getContext('2d');

ctx.canvas.width = 38;
ctx.canvas.height = 38;

let last;

function drawIcon() {
  if (last === matchMedia('(prefers-color-scheme: dark)').matches) {
    return false;
  }

  if (matchMedia('(prefers-color-scheme: dark)').matches) {
    const img = new Image();

    img.src = 'dist/default_icon_dark@2x.png';

    img.onload = () => {
      ctx.drawImage(img, 0, 0);

      chrome.browserAction.setIcon({
        imageData: ctx.getImageData(0, 0, 38, 38)
      });
    };
  }

  if (!matchMedia('(prefers-color-scheme: dark)').matches) {
    const img = new Image();

    img.src = 'dist/default_icon@2x.png';

    img.onload = () => {
      ctx.drawImage(img, 0, 0);

      chrome.browserAction.setIcon({
        imageData: ctx.getImageData(0, 0, 38, 38)
      });
    };
  }

  last = matchMedia('(prefers-color-scheme: dark)').matches;
}

setInterval(drawIcon, 1000);

drawIcon();
