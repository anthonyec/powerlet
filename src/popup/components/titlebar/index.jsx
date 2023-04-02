import React from 'react';

import Button from '../../components/button';
import Icon from '../../components/icon';

import "./titlebar.css"

export default function Titlebar({ title = "", onBackClick = () => {} }) {
  return (
    <div className="titlebar">
      <Button className="titlebar__back-button" icon={<Icon name="arrow-left" />} type="icon-only" onClick={onBackClick} />

      <h1 className="titlebar__title">
        {title}
      </h1>
    </div>
  )
}
