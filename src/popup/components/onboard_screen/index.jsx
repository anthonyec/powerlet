import React from 'react';
import { useDispatch } from 'react-redux';

import { navigateTo } from '../../store/actions/ui';

import './onboard_screen.css';

export default function OnboardScreen() {
  const dispatch = useDispatch();

  const handleExampleOnClick = () => {
    dispatch(navigateTo('examples.html'));
  };

  return (
    <div className="onboard-screen">
      <div className="onboard-screen__message">
        You don't have any bookmark&nbsp;scripts.
      </div>

      <button onClick={handleExampleOnClick} className="onboard-screen__button">
        Get started
      </button>
    </div>
  );
}
