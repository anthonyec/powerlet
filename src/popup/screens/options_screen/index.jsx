import React from 'react';

import './options_screen.css';
import OptionControl from '../../components/option_control';

export default function OptionsScreen() {
  return (
    <div className="options-screen">
      <OptionControl
        title="Add button"
        description={`Show the "+" button next to links that might be bookmarklets.`}
      />
    </div>
  );
}
