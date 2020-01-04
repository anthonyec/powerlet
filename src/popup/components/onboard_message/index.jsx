import React from 'react';
import { useDispatch } from 'react-redux';

import { navigateTo } from '../../store/actions/ui';
import Button from '../button';

import './onboard_message.css';

export default function OnboardMessage() {
  const dispatch = useDispatch();

  const handleExampleOnClick = () => {
    dispatch(navigateTo('examples.html'));
  };

  return (
    <div className="onboard-message">
      <div className="onboard-message__message">
        You don't have any
        <br />
        bookmark&nbsp;scripts.
      </div>

      <Button onClick={handleExampleOnClick}>Add scripts</Button>
    </div>
  );
}
