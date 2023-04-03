import React, { useEffect, useState } from 'react';

import Button from '../../components/button';
import TextField from '../../components/text_field';
import Titlebar from '../../components/titlebar';

import './edit_bookmarklet_screen.css';

export default function EditBookmarkletScreen({
  route = { params: {}, base: '' }
}) {
  const [bookmarklet, setBookmarklet] = useState({});

  useEffect(() => {
    if (!route.params.id) return;

    chrome.bookmarks.get(route.params.id, (bookmark) => {
      setBookmarklet(bookmark[0]);
    });
  }, [route.params.id]);

  const handleRemoveClick = () => {
    confirm('Are you sure you want to remove this script?');
  };

  const handleBackClick = () => {
    window.location.hash = '';
  };

  const handleTitleChange = (title) => {
    chrome.bookmarks.update(bookmarklet.id, { title });
  };

  return (
    <div className="edit-bookmarklet-screen">
      <Titlebar title="Edit script" onBackClick={handleBackClick} />

      <div className="edit-bookmarklet-screen__content">
        <TextField
          label="Name"
          defaultValue={bookmarklet.title}
          onChange={handleTitleChange}
        />
      </div>

      <div className="edit-bookmarklet-screen__footer">
        <Button onClick={handleRemoveClick}>Remove</Button>
        <Button onClick={handleBackClick} type="primary">
          Done
        </Button>
      </div>
    </div>
  );
}
