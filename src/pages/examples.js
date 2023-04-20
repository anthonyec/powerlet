import '../content/index.js';

const translationElements = document.querySelectorAll('[data-translation-key]');

Array.from(translationElements).forEach((element) => {
  const key = element.getAttribute('data-translation-key');
  const replacement = element.getAttribute('data-translation-replacement');
  const translation = chrome.i18n.getMessage(key);

  if (translation) {
    if (replacement) {
      element.innerHTML = translation.replace('%r', replacement);
    } else {
      element.textContent = translation;
    }
  }
});
