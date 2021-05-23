import React, { useRef } from 'react';

import './scroll_view.css';

export default function ScrollView({ children }) {
  const scrollViewRef = useRef();

  const scrollToElement = (targetElement) => {
    const scrollViewElement = scrollViewRef.current;

    if (scrollViewElement && targetElement) {
      const parent = scrollViewRef.current.getBoundingClientRect();
      const child = targetElement.getBoundingClientRect();
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
  };

  return (
    <div className="scroll-view" ref={scrollViewRef}>
      {children && typeof children === 'function' && children(scrollToElement)}
    </div>
  );
}
