import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { clamp } from '../../lib/clamp';

import './context_menu.css';

const PADDING = 5;

export default function ContextMenu({
  position = { x: 0, y: 0 },
  items = [],
  onDismiss = () => {}
}) {
  const menuRef = useRef(null);
  const [highlighted, setHighlighted] = useState(-1);
  const [showMenu, setShowMenu] = useState(true);
  const [menuPosition, setMenuPosition] = useState(position);

  const dismiss = () => {
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

  const handleItemMouseEnter = (index) => {
    setHighlighted(index);
  };

  const handleItemMouseLeave = () => {
    setHighlighted(-1);
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
      if (event.code === 'Escape') {
        event.preventDefault();
        dismiss();
      }

      if (event.code === 'ArrowUp') {
        event.preventDefault();
        const nextHighlighted =
          highlighted - 1 < 0 ? items.length - 1 : highlighted - 1;
        setHighlighted(nextHighlighted);
      }

      if (event.code === 'ArrowDown') {
        event.preventDefault();
        const nextHighlighted =
          highlighted + 1 > items.length - 1 ? 0 : highlighted + 1;
        setHighlighted(nextHighlighted);
      }

      if (event.code === 'Enter') {
        event.preventDefault();
        items[highlighted].action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [highlighted]);

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
          {items
            .filter((item) => !item.hidden)
            .map((item, index) => {
              const className =
                highlighted === index
                  ? 'context-menu__item context-menu__item--highlighted'
                  : 'context-menu__item';

              return (
                <div
                  key={item.key}
                  className={className}
                  onClick={() => {
                    item.action();
                    dismiss();
                  }}
                  onMouseEnter={handleItemMouseEnter.bind(null, index)}
                  onMouseLeave={handleItemMouseLeave}
                >
                  {item.title}
                </div>
              );
            })}
        </dialog>
      )}
    </div>
  );
}
