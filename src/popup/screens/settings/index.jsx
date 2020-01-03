import React from 'react';

import './settings.css';

export default function SettingsScreen() {
  return (
    <div className="settings-screen">
      Shortcut <input value="⇧⌘K" disabled />
      <button>Edit</button>
      <br />
      <br />
      Send anonymous analytics <input type="checkbox" checked />
      <br />
      <br />
      Made by <a href="http://anthony.ec">Anthony Cossins</a>
    </div>
  );
}
