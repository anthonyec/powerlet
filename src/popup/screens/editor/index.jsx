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

  useLayoutEffect(() => {
    window.document.title = 'Edit script';
  }, []);

  useEffect(() => {
    if (route.params.id) {
      dispatch(fetchBookmarklet(route.params.id));
    }
  }, [route.params.id]);

  const handleCodeEditorOnChange = (value) => {
    dispatch(
      updateCurrentFile({
        code: value
      })
    );

    dispatch(saveCurrentFile());
  };

  const handleTitleOnChange = (value) => {
    dispatch(
      updateCurrentFile({
        title: value
      })
    );

    dispatch(saveCurrentFile());
  };

  return (
    <div className="editor-screen">
      <div className="editor-screen__section">
        <TextField
          label="Name"
          defaultValue={currentFile && currentFile.title}
          onChange={handleTitleOnChange}
        />
      </div>
      <div className="editor-screen__section editor-screen__section--full">
        <CodeEditor
          defaultValue={currentFile && currentFile.code}
          onChange={handleCodeEditorOnChange}
        />
      </div>
    </div>
  );
}
