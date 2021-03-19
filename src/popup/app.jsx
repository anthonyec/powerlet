import React, { Suspense } from 'react';
import { useDispatch } from 'react-redux';

import zipObject from '../utils/zipObject';
import { fetchLocaleMessages } from './store/actions/locale';

import HomeScreen from './screens/home_screen';
const SettingsScreen = React.lazy(() => import('./screens/settings'));
const EditorScreen = React.lazy(() => import('./screens/editor_screen'));

import './reset.css';
import './app.css';

export default function App() {
  const dispatch = useDispatch();

  dispatch(fetchLocaleMessages());

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
