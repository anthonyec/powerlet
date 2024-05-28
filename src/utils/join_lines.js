export function joinLines(...lines) {
  let text = '';

  for (const line of lines) {
    text += line + '\n';
  }

  return text;
}
