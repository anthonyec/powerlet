import React, { Suspense } from 'react';

import Popup from './screens/popup';
const Settings = React.lazy(() => import('./screens/settings'));

import './reset.css';
import './app.css';

export default function App() {
  const path = window.location.hash.replace('#', '');
  const screens = {
    '': Popup,
    settings: Settings
  };

  // Render Popup by default if hash does not match.
  const Screen = screens[path] ? screens[path] : Popup;

  return (
    <div className="app">
      <Suspense fallback={<div>Loading...</div>}>
        <Screen />
      </Suspense>
    </div>
  );
}
