import React from 'react';

import './context_menu.css';

export function ContextMenu() {
  return (
    <dialog className="context-menu" open>
      <div className="context-menu__item">Move to "Other scripts"</div>
      <div className="context-menu__item">Delete</div>
    </dialog>
  );
}
