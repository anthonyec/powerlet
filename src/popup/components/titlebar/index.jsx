import React, { useEffect, useRef } from 'react';

import Icon from '../../components/icon';
import IconButton from '../icon_button';

import './titlebar.css';

export default function Titlebar({ title = '', onBackClick = () => {} }) {
  const backButtonRef = useRef(null);

  useEffect(() => {
    if (backButtonRef.current) {
      // backButtonRef.current.focus();
    }
  }, []);

  return (
    <div className="titlebar">
      <IconButton
        ref={backButtonRef}
        className="titlebar__back-button"
        onClick={onBackClick}
      >
        <Icon name="arrow-left" />
      </IconButton>

      <h1 className="titlebar__title">{title}</h1>
    </div>
  );
}
