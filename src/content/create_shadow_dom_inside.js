export function createShadowDomInside(target) {
  const shadowElement = document.createElement('div');

  shadowElement.style.background = 'none';
  shadowElement.style.border = 'none';
  shadowElement.style.outline = 'none';
  shadowElement.style.boxShadow = 'none';
  shadowElement.style.margin = '0';
  shadowElement.style.padding = '0';
  shadowElement.style.top = '0';
  shadowElement.style.left = '0';
  shadowElement.style.transform = 'none';
  shadowElement.style.width = '0';
  shadowElement.style.height = '0';
  shadowElement.style.minWidth = '0';
  shadowElement.style.minHeight = '0';
  shadowElement.style.position = 'relative';
  shadowElement.style.display = 'inline';

  target.appendChild(shadowElement);

  return shadowElement.attachShadow({ mode: 'open' });
}