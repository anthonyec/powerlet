import React, { Suspense, startTransition, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import * as identifiers from "../identifiers";
import { isMessage } from '../utils/is_message';
import zipObject from '../utils/zipObject';
import HomeScreen from './screens/home_screen';
import { fetchLocaleMessages } from './store/actions/locale';
import { firePageView } from './store/actions/stats';

const EditBookmarkletScreen = React.lazy(() =>
  import('./screens/edit_bookmarklet_screen')
);
const SettingsScreen = React.lazy(() => import('./screens/settings'));

import './reset.css';

import './app.css';

function parseHashPath(hash) {
  const hashPath = hash.replace('#', '');

  if (hashPath.startsWith('?')) {
    return [];
  }

  const [segments] = hashPath.split('?');

  return segments.split('/');
}

function parseHashQuery(hash) {
  const rawQueries = hash.replace('#', '').split('?');

  if (rawQueries.length <= 1) {
    return {};
  }

  const [_, queries] = rawQueries;
  const params = queries
    .split('&')
    .map((query) => query.split('='))
    .reduce((acc, param) => {
      acc[param[0]] = param[1];
      return acc;
    }, {});

  return params;
}

function useIsSleepyServiceWorkerAwake() {
  const [isAwake, setIsAwake] = useState(false)

  useEffect(() => {
    chrome.runtime.sendMessage({ type: identifiers.pingEvent }, (response) => {
      if (!isMessage(response)) return

      if (response.type === identifiers.pongEvent) {
        setIsAwake(true)
      }
    })
  }, [])

  return isAwake
}

export default function App() {
  const dispatch = useDispatch();
  const [path, setPath] = useState(parseHashPath(window.location.hash));
  const [query, setQuery] = useState(parseHashQuery(window.location.hash));
  const base = path[0];
  const params = path.slice(1);

  useIsSleepyServiceWorkerAwake()

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
    params: zippedParams,
    query
  };

  const Screen = screens[base] ? screens[base] : screens.home;

  useEffect(() => {
    dispatch(firePageView());
  }, [path]);

  useEffect(() => {
    const handleHashChange = () => {
      startTransition(() => {
        setPath(parseHashPath(window.location.hash));
        setQuery(parseHashQuery(window.location.hash));
      });
    };

    // Fetch translations on load.
    dispatch(fetchLocaleMessages());

    addEventListener('hashchange', handleHashChange);

    return () => {
      removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="app">
      <Suspense fallback={<div />}>
        <Screen route={route} />
      </Suspense>
    </div>
  );
}
