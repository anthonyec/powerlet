// Note, this does not ordered keys correctly according to OS conventions.
// Firefox provides wrong order even though in preferences it shows
// correct order.
export default function normalizeCommandShortcut(
  command = '',
  replacements = {}
) {
  let normalized = command;

  Object.keys(replacements).forEach((replacement) => {
    const regex = new RegExp(`\\${replacement}`, 'g');
    normalized = normalized.replace(regex, replacements[replacement]);
  }, '');

  return normalized;
}
