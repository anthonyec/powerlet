import React from 'react';

import OptionControl from '../../components/option_control';

import './options_screen.css';
import Toggle from '../../components/toggle';

export default function OptionsScreen() {
  return (
    <div className="options-screen">
      <section className="options-screen__section">
        <OptionControl
          title="Show add button"
          description={`Display a button next to links that might be bookmarklets.`}
        >
          <Toggle checked />
        </OptionControl>
      </section>
      <section className="options-screen__section options-screen__section--footer">
        Made by <a href="https://twitter.com/anthonyec" target="_blank">Anthony Cossins</a>
      </section>
    </div>
  );
}
