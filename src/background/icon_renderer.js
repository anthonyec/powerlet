function createCanvasContext(scale = 1, baseSize = 19) {
  const $canvas = document.createElement('canvas');
  const ctx = $canvas.getContext('2d');

  ctx.canvas.width = baseSize * scale;
  ctx.canvas.height = baseSize * scale;

  return ctx;
}

function drawImageOnContext(src, context) {
  return new Promise((resolve, reject) => {
    const width = context.canvas.width;
    const height = context.canvas.height;
    const img = new Image();

    img.src = src;

    img.onload = () => {
      context.drawImage(img, 0, 0, width, height);

      const imageData = context.getImageData(0, 0, width, height);

      resolve(imageData);
    };
  });
}

function createIconRenderer() {
  let wasDarkMode = null;

  return async () => {
    const isDarkMode = matchMedia('(prefers-color-scheme: dark)').matches;

    // Don't bother drawing and setting the icon if the color scheme has not
    // changed from last time.
    if (isDarkMode === wasDarkMode) {
      return;
    }

    const iconSrc = isDarkMode
      ? 'default_icon_dark@2x.png'
      : 'default_icon@2x.png';

    const ctx19 = createCanvasContext(1);
    const ctx38 = createCanvasContext(2);

    // Use the same retina size icon for both 19x19 and 38x38 icons. It looks
    // fine to me scaled down.
    const imageData19 = await drawImageOnContext(iconSrc, ctx19);
    const imageData38 = await drawImageOnContext(iconSrc, ctx38);

    chrome.browserAction.setIcon({
      imageData: {
        '19': imageData19,
        '38': imageData38
      }
    });

    // Remeber if this time was dark mode.
    wasDarkMode = isDarkMode;
  };
}

export default createIconRenderer;
