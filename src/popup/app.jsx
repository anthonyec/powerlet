import React, { Suspense } from 'react';

import zipObject from '../utils/zipObject';

import HomeScreen from './screens/home_screen';
const SettingsScreen = React.lazy(() => import('./screens/settings'));
const EditorScreen = React.lazy(() => import('./screens/editor'));

import './reset.css';
import './app.css';

export default function App() {
  const path = window.location.hash.replace('#', '').split('/');
  const base = path[0];
  const params = path.slice(1);

  const screens = {
    home: HomeScreen,
    settings: SettingsScreen,
    editor: EditorScreen
  };

  const screenParams = {
    editor: ['id']
  };

  const route = {
    base,
    params: zipObject(params, screenParams[base])
  };

  const Screen = screens[base] ? screens[base] : screens.home;

  return (
    <div className="app">
      <Suspense fallback={<div>Loading...</div>}>
        <Screen route={route} />
      </Suspense>
    </div>
  );
}
