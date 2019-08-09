import React from 'react';
import { useDispatch } from 'react-redux';

import {
  fetchAllBookmarklets,
  addExampleBookmarklets
} from '../../store/actions/bookmarklets';

export default function OnboardScreen() {
  const dispatch = useDispatch();

  const handleExampleOnClick = () => {
    dispatch(addExampleBookmarklets());
    dispatch(fetchAllBookmarklets());
  };

  return (
    <div className="onboard">
      <div className="onboard__message">
        You don't have any bookmark&nbsp;scripts.
      </div>

      <button onClick={handleExampleOnClick} className="onboard__button">
        Add Example Scripts
      </button>
    </div>
  );
}
