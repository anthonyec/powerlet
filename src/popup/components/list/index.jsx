import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { clamp } from '../../lib/clamp';
import ItemActions from '../item_actions';

import './list.css';

const KEYS = {
  ENTER: 13,
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  LEFT: 37
};

// Return an array of concatenated ids. This is used for useEffect which only
// shallow compares. Thus would always render when an array is used instead
// of a string or number.
// E.g [{ id: 3 }, { id: 2 }] becomes '32'.
function getArrayAsStringOfIds(array) {
  return array.map((item) => item.id).join('');
}

function shouldShowGroupHeading(previousItem, currentItem) {
  if (!previousItem && currentItem) {
    return true;
  }

  if (previousItem.group !== currentItem.group) {
    return true;
  }

  return false;
}

function getGroupHeadingFromItem(groups, item) {
  const foundGroup = groups.find((group) => {
    return group.id === item.group;
  });

  return foundGroup && foundGroup.title;
}

const List = React.forwardRef(
  (
    {
      initialSelectedItem = 0,
      items = [],
      groups = [],
      placeholder = '',
      disableKeyboardNavigation,
      disabled,
      loading,

      /** Callback when item is clicked or enter key is pressed. */
      onItemAction = () => {},
      onItemContextMenu = () => {},
      onEditClick = () => {}
    },
    ref
  ) => {
    const listClassName = groups.length > 0 ? 'list list--with-groups' : 'list';

    const [selectedItemIndex, setSelectedItemIndex] =
      useState(initialSelectedItem);
    const [hoveredItemIndex, setHoveredItemIndex] = useState(-1);
    const selectItemIndexRef = useRef(selectedItemIndex);

    // TODO: Hack fix for enter key to work correctly with up-to-date index
    selectItemIndexRef.current = selectedItemIndex;

    const handleHeadingContextMenu = (event) => {
      event.preventDefault();
    };

    const handleItemClick = useCallback(
      (item) => {
        if (disabled) return;
        onItemAction(item);
      },
      [disabled]
    );

    const handleItemContextMenu = useCallback(
      (index, item, event) => {
        event.preventDefault();
        if (disabled) return;
        setSelectedItemIndex(index);
        onItemContextMenu(index, item, { x: event.clientX, y: event.clientY });
      },
      [disabled]
    );

    const handleItemMouseEnter = (index) => {
      setHoveredItemIndex(index);
    };

    const handleItemMouseLeave = () => {
      setHoveredItemIndex(-1);
    };

    const handleItemEnter = useCallback(() => {
      if (disabled) return;
      const item = items[selectItemIndexRef.current];
      onItemAction(item);
    }, [items, disabled]);

    const getPrevIndex = (index) => {
      const calculatedIndex = index - 1;
      return calculatedIndex < 0 ? items.length - 1 : calculatedIndex;
    };

    const getNextIndex = (index) => {
      const calculatedIndex = index + 1;
      return calculatedIndex > items.length - 1 ? 0 : calculatedIndex;
    };

    const handleKeyDown = (event) => {
      if (disabled || disableKeyboardNavigation) return;

      switch (event.keyCode) {
        case KEYS.ENTER:
          event.preventDefault();
          handleItemEnter();
          break;

        case KEYS.UP:
          event.preventDefault();
          // Use state function for performance reasons. This allows us to
          // access previous state without rebinding the key listeners.
          // https://stackoverflow.com/a/62005831/4703489
          setSelectedItemIndex((prevIndex) => getPrevIndex(prevIndex));
          break;

        case KEYS.DOWN:
          event.preventDefault();
          setSelectedItemIndex((nextIndex) => getNextIndex(nextIndex));
          break;

        default:
      }
    };

    useEffect(() => {
      window.document.addEventListener('keydown', handleKeyDown);

      return () => {
        window.document.removeEventListener('keydown', handleKeyDown);
      };
    }, [disabled, disableKeyboardNavigation, getArrayAsStringOfIds(items)]);

    // Reset selected item when `items` change to avoid selected being
    // out of bounds when the array length changes.
    useEffect(() => {
      setSelectedItemIndex(clamp(initialSelectedItem, 0, items.length - 1));
    }, [getArrayAsStringOfIds(items)]);

    const renderedItems = items.map((item, index) => {
      const previousItem = index === 0 ? null : items[index - 1];
      const groupHeading = getGroupHeadingFromItem(groups, item);

      const showGroupHeading =
        groupHeading !== undefined &&
        groupHeading !== null &&
        shouldShowGroupHeading(previousItem, item);

      const isSelected = index === selectedItemIndex;
      const isHovered = index === hoveredItemIndex;

      const listItemClassNameWithGroup =
        groups.length !== 0 ? 'list__item--group' : '';
      const className = isSelected
        ? `list__item list__item--selected ${listItemClassNameWithGroup}`
        : `list__item ${listItemClassNameWithGroup}`;

      // If the selected item is under a heading, use the heading as the
      // element ref for the scroll view to scroll to. This keeps headings
      // always in view when moving down and then up the list.
      const useHeadingAsRef = isSelected && showGroupHeading;
      const useItemAsRef = isSelected && !showGroupHeading;
      const selectedItemRef = ref && ref.selectedItem;

      return (
        <React.Fragment key={item.id}>
          {showGroupHeading && (
            <div
              ref={useHeadingAsRef && showGroupHeading ? selectedItemRef : null}
              className="list__heading"
              onContextMenu={handleHeadingContextMenu}
            >
              {/* Empty space is used so that before translations are loaded the
              heading still takes up space with an empty string. */}
              {groupHeading}&nbsp;
            </div>
          )}
          <li
            ref={useItemAsRef ? selectedItemRef : null}
            className={className}
            onClick={handleItemClick.bind(null, item)}
            onContextMenu={handleItemContextMenu.bind(null, index, item)}
            onMouseEnter={handleItemMouseEnter.bind(null, index)}
            onMouseLeave={handleItemMouseLeave}
          >
            <div className="list__text">{item.title || placeholder}</div>

            {!loading && (isSelected || isHovered) && (
              <div className="list__actions">
                <ItemActions
                  onEditClick={onEditClick.bind(null, item)}
                  disabled={disabled}
                />
              </div>
            )}

            {loading && isSelected && <div className="list__spinner" />}
          </li>
        </React.Fragment>
      );
    });

    return <div className={listClassName}>{renderedItems}</div>;
  }
);

export default List;
