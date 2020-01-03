import React, { Suspense } from 'react';

import Popup from './screens/popup';
const Settings = React.lazy(() => import('./screens/settings'));

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
      <Suspense fallback={<div>Loading...</div>}>
        <Screen />
      </Suspense>
    </div>
  );
}
