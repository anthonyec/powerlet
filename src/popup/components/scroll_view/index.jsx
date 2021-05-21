import React, { useLayoutEffect, useRef } from 'react';

import './scroll_view.css';

export default function ScrollView({ targetRef = null, children }) {
  const scrollViewRef = useRef();

  // When using useEffect, sometimes the selected item is out of view for
  // 1 frame before it scrolls down, causing a small flash of unselected.
  // Using `useLayoutEffect` fixed this.
  // TODO: Learn why it fixes it!
  useLayoutEffect(() => {
    if (scrollViewRef.current && targetRef) {
      const parent = scrollViewRef.current.getBoundingClientRect();
      const child = targetRef.getBoundingClientRect();
      const shouldScrollUp = child.y < parent.y;
      const shouldScrollDown =
        child.y + child.height > parent.y + parent.height;

      // TODO: Make it scroll fully to the top or bottom if the gap at is small.
      if (shouldScrollUp) {
        const scrollY = scrollViewRef.current.scrollTop - (parent.y - child.y);
        scrollViewRef.current.scrollTo(0, scrollY);
      }

      if (shouldScrollDown) {
        // This finds the difference between the bottom of the parent and bottom
        // of the child.
        const scrollY =
          scrollViewRef.current.scrollTop +
          (child.y + child.height - (parent.y + parent.height));
        scrollViewRef.current.scrollTo(0, scrollY);
      }
    }
  }, [targetRef]);

  return (
    <div className="scroll-view" ref={scrollViewRef}>
      {children}
    </div>
  );
}
