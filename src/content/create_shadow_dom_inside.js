export function createShadowDomInside(target) {
  const shadowElement = document.createElement('div');

  shadowElement.style.background = "none";
  shadowElement.style.border = "none";
  shadowElement.style.outline = "none";
  shadowElement.style.boxShadow = "none";
  shadowElement.style.margin = "0";
  shadowElement.style.padding = "0";
  shadowElement.style.top = "0";
  shadowElement.style.left = "0";
  shadowElement.style.transform = "none";
  shadowElement.style.zIndex = "2147483647";
  shadowElement.style.width = "0";
  shadowElement.style.height = "0";
  shadowElement.style.minWidth = "0";
  shadowElement.style.minHeight = "0";
  shadowElement.style.display = "inline-block";

  target.appendChild(shadowElement);

  return shadowElement.attachShadow({ mode: "open" });
}
