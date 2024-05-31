import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/button';
import { navigateTo } from '../../store/actions/ui';
import { selectTranslations } from '../../store/selectors/locale';

import illustrationDarkEn from './dev_mode_dark_en.svg';
import illustrationDarkJa from './dev_mode_dark_ja.svg';
import illustrationLightEn from './dev_mode_light_en.svg';
import illustrationLightJa from './dev_mode_light_ja.svg';

import './setup_screen.css';

function useDarkMode() {
  const query = window.matchMedia('(prefers-color-scheme: dark)');

  const [isDarkMode, setIsDarkMode] = useState(query.matches);

  useEffect(() => {
    const controller = new AbortController();

    query.addEventListener(
      'change',
      () => {
        setIsDarkMode(query.matches);
      },
      { signal: controller.signal }
    );

    return () => controller.abort();
  });

  return isDarkMode;
}

function getIllustration(isDarkMode = false, language) {
  if (isDarkMode && language === "ja") {
    return illustrationDarkJa
  }

  if (!isDarkMode && language === "ja") {
    return illustrationLightJa
  }

  if (isDarkMode) {
    return illustrationDarkEn
  }

  if (!isDarkMode) {
    return illustrationLightEn
  }
}

export default function SetupScreen() {
  const dispatch = useDispatch();
  const isDarkMode = useDarkMode();
  const translations = useSelector(selectTranslations);

  const language = chrome.i18n.getUILanguage();

  const gotoExtensionsPage = () => {
    chrome.tabs.create({ url: 'chrome://extensions' });
  };

  const openLearnMoreLink = (event) => {
    event.preventDefault();
    dispatch(navigateTo(event.currentTarget.href));
  };

  const illustration = getIllustration(isDarkMode, language);

  return (
    <div className="setup-screen">
      <h1>{translations['enable_developer_mode_title']}</h1>

      <div className="setup-screen__image-container">
        <div
          className="setup-screen__image"
          dangerouslySetInnerHTML={{ __html: illustration }}
        />
      </div>

      <div className="setup-screen__message">
        <p>{translations['enable_developer_mode_message']}</p>

        <a href={`https://anthony.ec/powerlet-mv3?lang=${language}`} onClick={openLearnMoreLink}>
          {translations['learn_more_label']}
        </a>
      </div>

      <div className="setup-screen__actions">
        <Button onClick={gotoExtensionsPage} type="primary">
          {translations['open_extensions_page_label']}
        </Button>
      </div>
    </div>
  );
}
