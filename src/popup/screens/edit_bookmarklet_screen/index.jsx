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

    if (route.params.id === 'new') {
      chrome.bookmarks.create(
        {
          title: 'New script',
          url: 'javascript: '
        },
        (result) => {
          window.location.hash = `edit/${result.id}`;
        }
      );
      return;
    }

    const handleBookmarksChange = () => {
      chrome.bookmarks.get(route.params.id, (bookmark) => {
        if (!bookmark) {
          window.location.hash = '';
          return;
        }

        setBookmarklet(bookmark[0]);
      });
    };

    handleBookmarksChange();
    chrome.bookmarks.onChanged.addListener(handleBookmarksChange);
    chrome.bookmarks.onRemoved.addListener(handleBookmarksChange);

    return () => {
      chrome.bookmarks.onChanged.removeListener(handleBookmarksChange);
      chrome.bookmarks.onRemoved.removeListener(handleBookmarksChange);
    };
  }, [route.params.id]);

  const handleRemoveClick = () => {
    const shouldRemove = confirm(
      translations["remove_script_confirmation"]
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

  const handleCodeChange = (code) => {
    chrome.bookmarks.update(bookmarklet.id, { url: code });
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
        <TextField
          label={translations['code_field_label']}
          defaultValue={bookmarklet.url}
          onChange={handleCodeChange}
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
