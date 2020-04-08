import React, { Suspense } from 'react';

import zipObject from '../utils/zip_object';

import HomeScreen from './screens/home_screen';
const SettingsScreen = React.lazy(() => import('./screens/settings'));
const EditorScreen = React.lazy(() => import('./screens/editor_screen'));

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

  const zippedParams = screenParams[base]
    ? zipObject(params, screenParams[base])
    : [];

  const route = {
    base,
    params: zippedParams
  };

  const Screen = screens[base] ? screens[base] : screens.home;

  return (
    <div className="app">
      <Suspense fallback={<div />}>
        <Screen route={route} />
      </Suspense>
    </div>
  );
}
