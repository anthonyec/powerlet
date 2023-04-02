import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Button from '../../components/button';
import Icon from '../../components/icon';
import TextField from '../../components/text_field';
import Dropdown from '../../components/dropdown';
import Titlebar from '../../components/titlebar';

import "./edit_bookmarklet_screen.css"

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
    confirm("Are you sure you want to remove this script?")
  };

  const handleBackClick = () => {
    window.location.hash = ""
  };

  return (
    <div className="edit-bookmarklet-screen">
      <Titlebar title="Edit script" onBackClick={handleBackClick} />

      <div className="edit-bookmarklet-screen__content">
        <TextField label="Name" defaultValue={bookmarklet.title} />
        <TextField label="Code" defaultValue={bookmarklet.url} />
      </div>

      <div className="edit-bookmarklet-screen__footer">
        <Button onClick={handleRemoveClick}>Remove</Button>
        <Button onClick={handleRemoveClick} type="primary">Done</Button>
      </div>
    </div>
  );
}
