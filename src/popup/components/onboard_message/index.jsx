import React from 'react';
import { useDispatch } from 'react-redux';

import { navigateTo } from '../../store/actions/ui';
import EmptyMessage from '../empty_message';
import Button from '../button';

import './onboard_message.css';

export default function OnboardMessage() {
  const dispatch = useDispatch();

  const handleExampleOnClick = () => {
    dispatch(navigateTo('examples.html'));
  };

  return (
    <EmptyMessage message="You don't have any bookmark scripts.">
      <Button
        className="onboard-message__button"
        onClick={handleExampleOnClick}
      >
        Add scripts
      </Button>
    </EmptyMessage>
  );
}
