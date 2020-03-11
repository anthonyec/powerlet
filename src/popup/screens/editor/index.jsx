import React, { useLayoutEffect, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchBookmarklet, saveCurrentFile } from '../../store/actions/editor';
import Button from '../../components/button';

import './editor.css';

export default function Editor({ route = { params: {}, base: '' } }) {
  const dispatch = useDispatch();
  const currentFile = useSelector((state) => state.editor.currentFile);
  const isLoading = useSelector((state) => state.editor.isLoading);

  useLayoutEffect(() => {
    window.document.title = 'Edit Script';
  }, []);

  useEffect(() => {
    if (route.params.id) {
      dispatch(fetchBookmarklet(route.params.id));
    }
  }, [route.params.id]);

  const handleDeleteOnClick = () => {
    // dispatch(deleteCurrentFile());
  };

  const handleSaveOnClick = () => {
    dispatch(saveCurrentFile());
  };

  return (
    <div className="editor-screen">
      <input type="text" readOnly value={currentFile && currentFile.title} />
      <br />
      <textarea
        cols="60"
        rows="20"
        readOnly
        value={currentFile && currentFile.code}
      />
      <br />
      <Button onClick={handleSaveOnClick} disabled={isLoading}>
        Save
      </Button>
      {isLoading ? 'Loading' : null}
    </div>
  );
}
