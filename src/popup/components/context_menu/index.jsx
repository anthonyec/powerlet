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

  const handleItemContextMenu = (index, event) => {
    event.preventDefault();
    executeAction(index);
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

    let offsetX = 0;
    let offsetY = 0;

    if (bounds.right > viewport.width) {
      offsetX -= bounds.right - viewport.width + PADDING;
    }

    if (bounds.bottom > viewport.height) {
      offsetY -= bounds.height + PADDING;
    }

    // Viewport is too short, place on either side of the cursor.
    if (bounds.bottom > viewport.height && position.y - bounds.height < 0) {
      if (bounds.right > viewport.width) {
        setMenuPosition({
          x: position.x - (bounds.width + PADDING),
          y: viewport.height / 2 - bounds.height / 2
        });
      } else {
        setMenuPosition({
          x: position.x + PADDING,
          y: viewport.height / 2 - bounds.height / 2
        });
      }

      return;
    }

    setMenuPosition({
      x: position.x + offsetX,
      y: position.y + offsetY
    });
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

            if (item.type) {
              className += ` context-menu__item--${item.type}`;
            }

            return (
              <div
                key={item.key}
                className={className}
                onContextMenu={handleItemContextMenu.bind(null, index)}
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
