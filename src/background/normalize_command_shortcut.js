export default function normalizeCommandShortcut(command = '') {
  const macMapping = {
    MacCtrl: '^',
    Command: '⌘',
    Alt: '⌥',
    Shift: '⇧'
  };

  const normalized = command.split('+').map((key) => {
    if (macMapping[key]) {
      return macMapping[key];
    }

    return key;
  });

  return normalized.join('');
}
