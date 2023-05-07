import React from 'react';
import { useSelector } from 'react-redux';

import { selectTranslations } from '../../store/selectors/locale';
import Toggle from '../../components/toggle';
import OptionControl from '../../components/option_control';

import './options_screen.css';

export default function OptionsScreen() {
  const translations = useSelector(selectTranslations);

  return (
    <div className="options-screen">
      <section className="options-screen__section">
        <OptionControl
          title={translations['options_show_add_bookmarklet_heading']}
          description={translations['options_show_add_bookmarklet_description']}
        >
          <Toggle checked />
        </OptionControl>
      </section>
      <section className="options-screen__section options-screen__section--footer">
        <a href="https://twitter.com/anthonyec" target="_blank">
          {translations['options_made_by_label'].replace(
            '%s',
            'Anthony Cossins'
          )}
        </a>
      </section>
    </div>
  );
}
