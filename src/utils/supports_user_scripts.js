export function supportsUserScripts() {
  try {
    chrome.userScripts;
    return true;
  } catch (_err) {
    return false;
  }
}
