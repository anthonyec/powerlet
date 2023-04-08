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
  const [executingAction, setExecutingAction] = useState(null);
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

  const executeAction = (index) => {
    if (executingAction !== null) {
      return;
    }

    setExecutingAction(index);

    // Wait for executing flash animation to finish.
    setTimeout(() => {
      items[index].action();
      dismiss();
    }, 150);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();

    if (executingAction !== null) {
      return;
    }

    dismiss();
  };

  const handleItemMouseEnter = (index) => {
    if (executingAction !== null) {
      return;
    }

    setHighlighted(index);
  };

  const handleItemMouseLeave = () => {
    if (executingAction !== null) {
      return;
    }

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
      if (executingAction) {
        return;
      }

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
        executeAction(highlighted);
      }
    };

    const handleMouseUp = () => {
      if (highlighted !== -1) {
        executeAction(highlighted);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [highlighted, executingAction]);

  return (
    <div className="context-menu">
      <div
        className="context-menu__overlay"
        onClick={dismiss}
        onContextMenu={handleContextMenu}
      />
      {showMenu && (
        <dialog
          ref={menuRef}
          className="context-menu__menu"
          style={{ left: menuPosition.x, top: menuPosition.y }}
          open
        >
          {items.map((item, index) => {
            let className = 'context-menu__item';

            if (highlighted === index) {
              className += ' context-menu__item--highlighted';
            }

            if (executingAction === index) {
              className += ' context-menu__item--executing-action';
            }

            return (
              <div
                key={item.key}
                className={className}
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
