import React from 'react';

import Popup from './screens/popup';
import Settings from './screens/settings';

import './reset.css';
import './app.css';

export default function App() {
  const path = window.location.hash.replace('#', '');

  let Screen = Popup;

  if (path === 'settings') {
    Screen = Settings;
  }

  return (
    <div className="app">
      <Screen />
    </div>
  );
}
