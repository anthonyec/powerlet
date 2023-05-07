import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useTranslations } from '../../hooks/use_translations';
import { setShowAddButton } from '../../store/actions/options';
import { selectOptions } from '../../store/selectors/options';
import Toggle from '../../components/toggle';
import OptionControl from '../../components/option_control';

import './options_screen.css';

export default function OptionsScreen() {
  const dispatch = useDispatch();
  const options = useSelector(selectOptions);
  const translations = useTranslations();

  const handleShowAddButtonToggled = (isChecked) => {
    dispatch(setShowAddButton(isChecked));
  };

  return (
    <div className="options-screen">
      <section className="options-screen__section">
        <OptionControl
          title={translations.get('options_show_add_bookmarklet_heading')}
          description={translations.get(
            'options_show_add_bookmarklet_description'
          )}
        >
          <Toggle
            checked={options['showAddButton']}
            onChange={handleShowAddButtonToggled}
          />
        </OptionControl>
      </section>
      <section className="options-screen__section options-screen__section--footer">
        <a href="https://twitter.com/anthonyec" target="_blank">
          {translations.get('options_made_by_label', '%s', 'Anthony Cossins')}
        </a>
      </section>
    </div>
  );
}
