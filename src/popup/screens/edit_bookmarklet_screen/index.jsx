import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Button from '../../components/button';
import TextField from '../../components/text_field';
import Titlebar from '../../components/titlebar';
import { selectTranslations } from '../../store/selectors/locale';

import './edit_bookmarklet_screen.css';

export default function EditBookmarkletScreen({
  route = { params: {}, base: '' }
}) {
  const [bookmarklet, setBookmarklet] = useState({});
  const translations = useSelector(selectTranslations);

  useEffect(() => {
    if (!route.params.id) return;

    chrome.bookmarks.get(route.params.id, (bookmark) => {
      setBookmarklet(bookmark[0]);
    });
  }, [route.params.id]);

  const handleRemoveClick = () => {
    const shouldRemove = confirm(
      'Are you sure you want to remove this script?'
    );

    if (shouldRemove) {
      chrome.bookmarks.remove(bookmarklet.id, () => {
        window.location.hash = '';
      });
    }
  };

  const handleBackClick = () => {
    window.location.hash = '';
  };

  const handleTitleChange = (title) => {
    chrome.bookmarks.update(bookmarklet.id, { title });
  };

  return (
    <div className="edit-bookmarklet-screen">
      <Titlebar
        title={translations['edit_script_title']}
        onBackClick={handleBackClick}
      />

      <div className="edit-bookmarklet-screen__content">
        <TextField
          label={translations['name_field_label']}
          defaultValue={bookmarklet.title}
          onChange={handleTitleChange}
        />
      </div>

      <div className="edit-bookmarklet-screen__footer">
        <Button onClick={handleRemoveClick}>
          {translations['remove_button']}
        </Button>
        <Button onClick={handleBackClick} type="primary">
          {translations['done_button']}
        </Button>
      </div>
    </div>
  );
}
