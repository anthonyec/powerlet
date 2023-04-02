import React from 'react';

import Button from '../../components/button';
import Icon from '../../components/icon';
import IconButton from '../icon_button';

import './titlebar.css';

export default function Titlebar({ title = '', onBackClick = () => {} }) {
  return (
    <div className="titlebar">
      <IconButton className="titlebar__back-button" onClick={onBackClick}>
        <Icon name="arrow-left" />
      </IconButton>

      <h1 className="titlebar__title">{title}</h1>
    </div>
  );
}
