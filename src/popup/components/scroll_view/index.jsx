import React, { useEffect, useRef } from 'react';

import './scroll_view.css';

export default function ScrollView({
  children,
  x = 0,
  y = 0,
  onScroll = () => {}
}) {
  const scrollViewRef = useRef();

  const handleOnScroll = () => {
    onScroll(scrollViewRef.current.scrollLeft, scrollViewRef.current.scrollTop);
  };

  useEffect(() => {
    scrollViewRef.current.scrollTo(x, y);
  }, [x, y]);

  useEffect(() => {
    scrollViewRef.current.addEventListener('scroll', handleOnScroll);

    return () => {
      scrollViewRef.current.removeEventListener('scroll', handleOnScroll);
    };
  }, []);

  return (
    <div className="scroll-view" ref={scrollViewRef}>
      {children}
    </div>
  );
}
