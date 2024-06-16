import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/button';
import { ControlRow } from '../../components/control_row';
import TextField from '../../components/text_field';
import Titlebar from '../../components/titlebar';
import Toast from '../../components/toast';
import Toggle from '../../components/toggle';

import { useBrowserBookmarks } from '../../hooks/use_browser_bookmarks';
import { useBrowserLocalStorage } from '../../hooks/use_browser_local_storage';
import { useToast } from '../../hooks/use_toast';

import { fetchAllBookmarklets } from '../../store/actions/bookmarklets';
import { selectTranslations } from '../../store/selectors/locale';
import clampText from '../../lib/clamp_text';

import './edit_bookmarklet_screen.css';

function returnToHomeScreen(id) {
  if (id) {
    window.location.hash = `?selected=${id}`;
    return;
  }

  window.location.hash = '';
}

export default function EditBookmarkletScreen({
  route = { params: {}, base: '' }
}) {
  const dispatch = useDispatch();
  const [bookmarklet, setBookmarklet] = useState(null);
  const translations = useSelector(selectTranslations);
  const toast = useToast();
  const bookmarks = useBrowserBookmarks();

  const storage = useBrowserLocalStorage(`settings_local:${route.params.id}`, {
    allowPopups: true
  });

  useEffect(() => {
    toast.hide();
  }, []);

  useEffect(() => {
    if (!route.params.id) {
      returnToHomeScreen();
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

    chrome.bookmarks.get(route.params.id, (bookmark) => {
      if (!bookmark || chrome.runtime.lastError) {
        returnToHomeScreen();
        return;
      }

      setBookmarklet(bookmark[0]);

      // Fetch bookmarks before returning to home screen to ensure new bookmark
      // exists so that it can be scrolled to.
      dispatch(fetchAllBookmarklets());
    });

    const handleBookmarkRemoved = (id) => {
      if (id === route.params.id) {
        returnToHomeScreen();
      }
    };

    chrome.bookmarks.onRemoved.addListener(handleBookmarkRemoved);

    return () => {
      chrome.bookmarks.onRemoved.removeListener(handleBookmarkRemoved);
    };
  }, [route.params.id]);

  const handleRemoveClick = async () => {
    await bookmarks.remove(bookmarklet);
    returnToHomeScreen();
  };

  const handleBackClick = () => {
    if (bookmarklet.url.trim() && !bookmarklet.url.startsWith('javascript:')) {
      toast.show({
        message: translations['script_not_visible_toast'].replace(
          '%s',
          clampText(bookmarklet.title)
        ),
        label: translations['fix_label'],
        action: () => {
          window.location.hash = `edit/${bookmarklet.id}`;
        }
      });
    }

    returnToHomeScreen(bookmarklet.id);
  };

  const handleToastActionClick = () => {
    setBookmarklet({ ...bookmarklet, url: 'javascript: ' + bookmarklet.url });
  };

  const handleTitleChange = (title) => {
    chrome.bookmarks.update(bookmarklet.id, { title });
    setBookmarklet({ ...bookmarklet, title });
  };

  const handleCodeChange = (code) => {
    chrome.bookmarks.update(bookmarklet.id, { url: code });
    setBookmarklet({ ...bookmarklet, url: code });
  };

  const handlePopupsChange = async (event) => {
    if (!event.currentTarget) return;
    await storage.set('allowPopups', event.currentTarget.checked);
  };

  return (
    <div className="edit-bookmarklet-screen">
      <Titlebar
        title={translations['edit_script_title']}
        onBackClick={handleBackClick}
      />

      <div className="edit-bookmarklet-screen__content">
        <ControlRow label={translations['name_field_label']}>
          <TextField
            defaultValue={bookmarklet?.title || ''}
            onChange={handleTitleChange}
          />
        </ControlRow>

        <ControlRow label={translations['code_field_label']}>
          <TextField
            defaultValue={bookmarklet?.url || ''}
            onChange={handleCodeChange}
          />
        </ControlRow>

        <ControlRow label="Popups" visible={storage.loaded}>
          <Toggle
            value={storage.values['allowPopups']}
            onChange={handlePopupsChange}
          />
        </ControlRow>

        {bookmarklet !== null && !bookmarklet.url.startsWith('javascript:') && (
          <div style={{ marginLeft: 58 }}>
            <Toast
              inline
              warning
              message={translations['script_missing_keyword_message']}
              label={translations['fix_label']}
              onActionClick={handleToastActionClick}
            />
          </div>
        )}
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
