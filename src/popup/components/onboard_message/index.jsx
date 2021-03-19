import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { navigateTo } from '../../store/actions/ui';
import Button from '../button';

import './onboard_message.css';

export default function OnboardMessage() {
  const dispatch = useDispatch();
  const translations = useSelector((state) => state.locale.messages);

  const handleExampleOnClick = () => {
    dispatch(navigateTo('examples.html'));
  };

  return (
    <div className="onboard-message">
      <div className="onboard-message__message">
        {translations['empty_state_message']}
      </div>

      <Button onClick={handleExampleOnClick}>
        {translations['empty_state_button']}
      </Button>
    </div>
  );
}
