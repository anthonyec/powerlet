import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Button from '../../components/button';
import TextField from '../../components/text_field';
import Titlebar from '../../components/titlebar';
import { selectTranslations } from '../../store/selectors/locale';
import { useBrowserBookmarks } from '../../hooks/use_browser_bookmarks';
import { useToast } from '../../hooks/use_toast';

import './edit_bookmarklet_screen.css';

export default function EditBookmarkletScreen({
  route = { params: {}, base: '' }
}) {
  const [bookmarklet, setBookmarklet] = useState({});
  const translations = useSelector(selectTranslations);
  const toast = useToast();
  const bookmarks = useBrowserBookmarks();

  useEffect(() => {
    toast.hide();
  }, []);

  useEffect(() => {
    if (!route.params.id) {
      window.location.hash = '';
      return;
    }

    if (route.params.id === 'new') {
      const newBookmarklet = {
        title: translations['new_script_name'],
        url: 'javascript: '
      };

      bookmarks
        .create(newBookmarklet)
        .then((result) => {
          window.location.hash = `edit/${result.id}`;
        })
        .catch((error) => {
          console.error('Failed to create bookmark', error);
          window.location.hash = ``;
        });

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
    chrome.bookmarks.onRemoved.addListener(handleBookmarksChange);

    return () => {
      chrome.bookmarks.onRemoved.removeListener(handleBookmarksChange);
    };
  }, [route.params.id]);

  const handleRemoveClick = async () => {
    await bookmarks.remove(bookmarklet);
    window.location.hash = '';
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
        <Button onClick={handleRemoveClick} type="danger">
          {translations['remove_button']}
        </Button>
        <Button onClick={handleBackClick} type="primary">
          {translations['done_button']}
        </Button>
      </div>
    </div>
  );
}
