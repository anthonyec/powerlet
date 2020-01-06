import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { version } from '../../../../package.json';
import { navigateTo, fetchShortcutKeys } from '../../store/actions/ui';
import Button from '../../components/button';
import TextField from '../../components/text_field';
import Link from '../../components/link';

import './settings_screen.css';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const shortcuts = useSelector((state) => state.ui.shortcuts);

  useEffect(() => {
    dispatch(fetchShortcutKeys());
  }, []);

  const handleShortcutEditClick = () => {
    dispatch(navigateTo('chrome://extensions/shortcuts'));
  };

  const defaultShortcut = shortcuts.find((shortcut) => {
    return (shortcut.name = '_execute_browser_action');
  });

  const shortcut = defaultShortcut && defaultShortcut.shortcut ? defaultShortcut.shortcut : null;

  return (
    <div className="settings-screen">
      <section className="settings-screen__section">
        <h1 className="settings-screen__section-title">Keyboard shortcut</h1>
        <div className="settings-screen__controls">
          {shortcut &&
            <div className="settings-screen__controls-item">
              <TextField value={shortcut} />
            </div>
          }
          <div className="settings-screen__controls-item">
            {shortcut && <Button onClick={handleShortcutEditClick}>Change</Button>}
            {!shortcut && <Button onClick={handleShortcutEditClick}>Add shortcut</Button>}
          </div>
        </div>
      </section>

      <section className="settings-screen__section">
        <h1 className="settings-screen_ _section-title">
          Made by
          <Link href="https://anthony.ec/powerlets-privacy-policy">
            Anthony Cossins
          </Link>
        </h1>
        v{version}
      </section>
    </div>
  );
}
