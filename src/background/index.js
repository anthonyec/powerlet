import createIconRenderer from './icon_renderer';
import normalizeCommandShortcut from './normalize_command_shortcut';

const renderIcon = createIconRenderer();

function updateTitleWithShortcut() {
  chrome.runtime.getPlatformInfo(function(info) {
    const macReplacements = {
      '+': '',
      Shift: '⇧',
      MacCtrl: '^',
      Alt: '⌥',
      Command: '⌘',
      Period: '.',
      Comma: ','
    };

    chrome.commands.getAll(function(commands) {
      const normalizedCommands = commands.map((command) => {
        const shortcutConfig = info.os === 'mac' ? macReplacements : {};

        return Object.assign({}, command, {
          shortcut: normalizeCommandShortcut(command.shortcut, shortcutConfig)
        });
      });

      const defaultCommand = normalizedCommands.find((command) => {
        return (command.name = '_execute_browser_action');
      });

      if (defaultCommand.shortcut) {
        chrome.browserAction.setTitle({
          title: `Powerlets (${defaultCommand.shortcut})`
        });
      }
    });
  });
}

function update() {
  updateTitleWithShortcut();
  renderIcon();
}

setInterval(update, 1000);
update();
