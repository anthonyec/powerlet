import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import zipObject from '../utils/zipObject';
import { firePageView } from './store/actions/stats';
import { fetchLocaleMessages } from './store/actions/locale';
import HomeScreen from './screens/home_screen';

const EditBookmarkletScreen = React.lazy(() =>
  import('./screens/edit_bookmarklet_screen')
);
const SettingsScreen = React.lazy(() => import('./screens/settings'));

import './reset.css';
import './app.css';

function parseHash(hash) {
  return hash.replace('#', '').split('/');
}

export default function App() {
  const dispatch = useDispatch();
  const [path, setPath] = useState(parseHash(window.location.hash));
  const base = path[0];
  const params = path.slice(1);

  const screens = {
    home: HomeScreen,
    edit: EditBookmarkletScreen,
    settings: SettingsScreen
  };

  const screenParams = {
    edit: ['id']
  };

  const zippedParams = screenParams[base]
    ? zipObject(params, screenParams[base])
    : [];

  const route = {
    base,
    params: zippedParams
  };

  const Screen = screens[base] ? screens[base] : screens.home;

  useEffect(() => {
    dispatch(firePageView());
  }, [path]);

  useEffect(() => {
    dispatch(fetchLocaleMessages());

    addEventListener("hashchange", (event) => {
      setPath(parseHash(window.location.hash))
    });
  }, []);

  return (
    <div className="app">
      <Suspense fallback={<div />}>
        <Screen route={route} />
      </Suspense>
    </div>
  );
}
