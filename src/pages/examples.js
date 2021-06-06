const translationElements = document.querySelectorAll('[data-translation-key]');

Array.from(translationElements).forEach((element) => {
  const key = element.getAttribute('data-translation-key');
  const translation = chrome.i18n.getMessage(key);

  if (translation) {
    element.textContent = translation;
  }
});
