import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectTranslations } from '../../store/selectors/locale';
import { navigateTo } from '../../store/actions/ui';
import EmptyMessage from '../empty_message';
import Button from '../button';

import './onboard_message.css';

export default function OnboardMessage() {
  const dispatch = useDispatch();
  const translations = useSelector(selectTranslations);

  const handleExampleOnClick = () => {
    dispatch(navigateTo('examples.html'));
  };

  return (
    <EmptyMessage message={translations['empty_state_message']}>
      <Button
        className="onboard-message__button"
        onClick={handleExampleOnClick}
      >
        {translations['add_scripts_button']}
      </Button>
    </EmptyMessage>
  );
}
