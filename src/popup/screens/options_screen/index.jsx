import React from 'react';

import OptionControl from '../../components/option_control';

import './options_screen.css';
import Toggle from '../../components/toggle';

export default function OptionsScreen() {
  return (
    <div className="options-screen">
      <OptionControl
        title="Add button"
        description={`Show the "+" button next to links that might be bookmarklets.`}
      >
        <Toggle checked />
      </OptionControl>
    </div>
  );
}
