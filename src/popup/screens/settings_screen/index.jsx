import React from 'react';
import { useDispatch } from 'react-redux';

import { navigateTo } from '../../store/actions/ui';
import Button from '../../components/button';

import './settings_screen.css';
import TextField from '../../components/text_field';
import Link from '../../components/link';

export default function SettingsScreen() {
  const dispatch = useDispatch();

  const handleShortcutEditClick = () => {
    dispatch(navigateTo('chrome://extensions/shortcuts'));
  };

  return (
    <div className="settings-screen">
      <section className="settings-screen__section">
        <h1 className="settings-screen__section-title">Keyboard shortcut</h1>
        <div className="settings-screen__controls">
          <div className="settings-screen__controls-item">
            <TextField defaultValue="⇧⌘K" disabled />
          </div>
          <div className="settings-screen__controls-item">
            <Button onClick={handleShortcutEditClick}>Edit</Button>
          </div>
        </div>
      </section>

      <section className="settings-screen__section">
        <h1 className="settings-screen__section-title">
          Made by
          <Link href="https://anthony.ec/powerlets-privacy-policy">
            Anthony Cossins
          </Link>
        </h1>
        <Link href="https://anthony.ec/powerlets-privacy-policy">
          Privacy Policy
        </Link>
      </section>
    </div>
  );
}
