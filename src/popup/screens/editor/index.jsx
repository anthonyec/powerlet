import React, { useLayoutEffect, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  fetchBookmarklet,
  saveCurrentFile,
  updateCurrentFile
} from '../../store/actions/editor';

import CodeEditor from '../../components/code_editor';
import TextField from '../../components/text_field';

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

  const handleSaveOnClick = () => {
    dispatch(saveCurrentFile());
    window.close();
  };

  const handleCodeEditorOnChange = (value) => {
    console.log('handleCodeEditorOnChange', value);

    dispatch(
      updateCurrentFile({
        code: value
      })
    );

    dispatch(saveCurrentFile());
  };

  const handleTitleOnChange = (value) => {
    console.log('handleTitleOnChange', value);

    dispatch(
      updateCurrentFile({
        title: value
      })
    );

    dispatch(saveCurrentFile());
  };

  return (
    <div className="editor-screen">
      <TextField
        label="Title"
        defaultValue={currentFile && currentFile.title}
        onChange={handleTitleOnChange}
      />
      <CodeEditor
        defaultValue={currentFile && currentFile.code}
        onChange={handleCodeEditorOnChange}
      />
      <br />
      {isLoading ? 'Loading' : null}
    </div>
  );
}
