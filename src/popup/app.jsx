import React, { Suspense } from 'react';

import HomeScreen from './screens/home';
const SettingsScreen = React.lazy(() => import('./screens/settings'));

import './reset.css';
import './app.css';

export default function App() {
  const path = window.location.hash.replace('#', '');
  const defaultScreen = HomeScreen;
  const screens = {
    '': defaultScreen,
    settings: SettingsScreen
  };

  const Screen = screens[path] ? screens[path] : defaultScreen;

  return (
    <div className="app">
      <Suspense fallback={<div>Loading...</div>}>
        <Screen />
      </Suspense>
    </div>
  );
}
