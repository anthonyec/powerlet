import React from 'react';
import { version } from '../../../../package.json';

import './settings.css';

export default function Settings() {
  return (
    <div className="settings">
      <section className="settings-section">
        <h2 className="settings-section__title">Shortcut</h2>
        <div>
          <input type="input" value="⇧⌘K" />
          <button>Edit</button>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section__title">Anonymous analytics</h2>
        <input type="checkbox" defaultChecked />
      </section>

      <section className="settings-section">
        <h2 className="settings-section__title">Privacy policy</h2>

        <a href="https://anthony.ec/">External</a>
      </section>

      <section className="settings-section">
        <h2 className="settings-section__title">
          Made by <a href="https://anthony.ec/">Anthony Cossins</a>
        </h2>

        <h2 className="settings-section__title">Powerlets {version}</h2>
      </section>

      {/* Shortcut <input value="⇧⌘K" disabled />
      <button>
        Edit
      </button>


      <br />
      <br />

      Send anonymous analytics <input type="checkbox" checked />

      <br />
      <br />

      Made by <a href="http://anthony.ec">Anthony Cossins</a> */}
    </div>
  );
}
