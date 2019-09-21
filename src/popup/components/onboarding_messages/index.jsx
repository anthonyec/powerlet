import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { navigateTo } from '../../store/actions/ui';
import { setMessageAsSeen } from '../../store/actions/user';

import Button from '../button';
import Dialog from '../dialog';

export default function OnboardingMessages() {
  const dispatch = useDispatch();
  const bookmarkletsCount = useSelector(
    (state) => state.bookmarklets.all.length
  );
  const isNewStarter = useSelector(
    (state) => !state.user.seenMessages.includes('new_starter')
  );

  const seenEmptyState = useSelector((state) =>
    state.user.seenMessages.includes('empty_state')
  );

  const showEmptyMessage = bookmarkletsCount === 0;
  const showNewStarterMessage =
    isNewStarter &&
    !seenEmptyState &&
    bookmarkletsCount > 0 &&
    bookmarkletsCount <= 8;

  const handleExampleOnClick = () => {
    dispatch(navigateTo('examples.html'));
    dispatch(setMessageAsSeen('empty_state'));
  };

  const handleGotItOnClick = () => {
    dispatch(setMessageAsSeen('new_starter'));
  };

  return (
    <React.Fragment>
      {showEmptyMessage && (
        <Dialog
          title="You don't have any scripts."
          message="Scripts saved to your bookmarks will automatically show up here."
          actions={<Button onClick={handleExampleOnClick}>Add scripts</Button>}
        />
      )}

      {showNewStarterMessage && (
        <Dialog
          message="Scripts saved to your bookmarks will automatically show up above."
          actions={<Button onClick={handleGotItOnClick}>OK, got it!</Button>}
        />
      )}
    </React.Fragment>
  );
}
