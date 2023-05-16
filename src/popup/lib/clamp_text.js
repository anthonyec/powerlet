export default function clampText(text = '', maxLength = 20) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '…';
  }

  return text;
}
