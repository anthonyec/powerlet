import React from 'react';
import { useDispatch } from 'react-redux';

import {
  fetchAllBookmarklets,
  addExampleBookmarklets
} from '../../store/actions/bookmarklets';

import './onboard_screen.css';

export default function OnboardScreen() {
  const dispatch = useDispatch();

  const handleExampleOnClick = () => {
    dispatch(addExampleBookmarklets());
    dispatch(fetchAllBookmarklets());
  };

  return (
    <div className="onboard-screen">
      <div className="onboard-screen__message">
        You don't have any bookmark&nbsp;scripts.
      </div>

      <button onClick={handleExampleOnClick} className="onboard-screen__button">
        Add Example Scripts
      </button>
    </div>
  );
}
