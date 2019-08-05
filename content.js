let keys = [];

document.addEventListener('keydown', (evt) => {
  keys.push(evt.keyCode);

  if (keys.length > 5) {
    keys.shift();
  }
});
