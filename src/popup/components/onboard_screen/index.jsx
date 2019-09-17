import React from 'react';
import { useDispatch } from 'react-redux';

import { navigateTo } from '../../store/actions/ui';
import Button from '../button';

import './onboard_screen.css';

export default function OnboardScreen() {
  const dispatch = useDispatch();

  const handleExampleOnClick = () => {
    dispatch(navigateTo('examples.html'));
  };

  return (
    <div className="onboard-screen">
      <div className="onboard-screen__message">
        You don't have any<br />bookmark&nbsp;scripts.
      </div>

      <Button onClick={handleExampleOnClick}>
        Add scripts
      </Button>
    </div>
  );
}
