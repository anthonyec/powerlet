import createIconRenderer from './icon_renderer';
import normalizeCommandShortcut from './normalize_command_shortcut';

const renderIcon = createIconRenderer();

function updateTitleWithShortcut() {
  chrome.commands.getAll(function(commands) {
    const normalizedCommands = commands.map((command) => {
      return Object.assign({}, command, {
        shortcut: normalizeCommandShortcut(command.shortcut)
      });
    });

    console.log('normalizedCommands', normalizedCommands);

    const defaultCommand = normalizedCommands.find((command) => {
      return (command.name = '_execute_browser_action');
    });

    if (defaultCommand.shortcut) {
      chrome.browserAction.setTitle({
        title: `Powerlets (${defaultCommand.shortcut})`
      });
    }
  });
}

function update() {
  updateTitleWithShortcut();
  renderIcon();
}

setInterval(update, 1000);
update();
