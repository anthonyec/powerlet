import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import './context_menu.css';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const PADDING = 5;

export default function ContextMenu({
  position = { x: 0, y: 0 },
  onDismiss = () => {}
}) {
  const menuRef = useRef(null);
  const [showMenu, setShowMenu] = useState(true);
  const [menuPosition, setMenuPosition] = useState(position);

  const dismiss = (event) => {
    setShowMenu(false);

    // Add timeout so that users can't click things underneath accidentally
    // when dismissing.
    setTimeout(() => {
      onDismiss();
    }, 150);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    dismiss();
  };

  useLayoutEffect(() => {
    const viewport = { width: window.innerWidth, height: window.innerHeight };

    if (!menuRef.current) {
      return;
    }

    const bounds = menuRef.current.getBoundingClientRect();

    const newPosition = {
      x:
        position.x -
        clamp(bounds.right - viewport.width + PADDING, 0, viewport.width),
      y:
        position.y -
        clamp(bounds.bottom - viewport.height + PADDING, 0, viewport.height)
    };

    setMenuPosition(newPosition);
  }, [position]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      event.preventDefault();

      if (event.code === 'Escape') {
        dismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      className="context-menu"
      onClick={dismiss}
      onContextMenu={handleContextMenu}
    >
      {showMenu && (
        <dialog
          ref={menuRef}
          className="context-menu__menu"
          style={{ left: menuPosition.x, top: menuPosition.y }}
          open
        >
          <div className="context-menu__item">Move to "Other scripts"</div>
          <div className="context-menu__item">Delete</div>
        </dialog>
      )}
    </div>
  );
}
