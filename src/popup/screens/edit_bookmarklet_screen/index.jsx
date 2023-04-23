import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Button from '../../components/button';
import TextField from '../../components/text_field';
import Titlebar from '../../components/titlebar';
import { selectTranslations } from '../../store/selectors/locale';
import { useUndoHistory } from '../../hooks/useUndoHistory';

import './edit_bookmarklet_screen.css';

export default function EditBookmarkletScreen({
  route = { params: {}, base: '' }
}) {
  const [bookmarklet, setBookmarklet] = useState({});
  const translations = useSelector(selectTranslations);
  const undoHistory = useUndoHistory();

  useEffect(() => {
    if (!route.params.id) return;

    if (route.params.id === 'new') {
      const newBookmarklet = {
        title: translations['new_script_name'],
        url: 'javascript: '
      };

      chrome.bookmarks.create(newBookmarklet, (result) => {
        const handle = undoHistory.createHandle(result.id);

        undoHistory.push(() => new Promise((resolve) => {
          chrome.bookmarks.remove(handle.value, () => {
            undoHistory.removeHandle(handle);
            resolve();
          });
        }));

        window.location.hash = `edit/${result.id}`;
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
    chrome.bookmarks.onChanged.addListener(handleBookmarksChange);
    chrome.bookmarks.onRemoved.addListener(handleBookmarksChange);

    return () => {
      chrome.bookmarks.onChanged.removeListener(handleBookmarksChange);
      chrome.bookmarks.onRemoved.removeListener(handleBookmarksChange);
    };
  }, [route.params.id]);

  const handleRemoveClick = async () => {
    chrome.bookmarks.remove(bookmarklet.id, () => {
      const handle = undoHistory.getHandleByValue(bookmarklet.id);

      undoHistory.push(() => new Promise((resolve) => {
        const result = chrome.bookmarks.create({
          index: bookmarklet.index,
          title: bookmarklet.title,
          url: bookmarklet.url
        }, (result) => {
          if (handle) {
            handle.update(result.id);
          }

          resolve();
        });
      }));
    });


    toast.show(`"${bookmarklet.title}" was deleted.`, undoHistory.pop);
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
