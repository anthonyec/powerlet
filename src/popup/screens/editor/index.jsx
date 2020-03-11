import React, { useLayoutEffect, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchBookmarklet, saveCurrentFile, updateCurrentFile } from '../../store/actions/editor';
import Button from '../../components/button';

import './editor.css';
import CodeEditor from '../../components/code_editor';

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

    dispatch(updateCurrentFile({
      code: value
    }));

    dispatch(saveCurrentFile());
  };

  return (
    <div className="editor-screen">
      <input type="text" readOnly value={currentFile && currentFile.title} />
      <br />
      <CodeEditor
        defaultValue={currentFile && currentFile.code}
        onChange={handleCodeEditorOnChange}
      />
      <br />
      <Button onClick={handleSaveOnClick} disabled={isLoading}>
        Done
      </Button>
      {isLoading ? 'Loading' : null}
    </div>
  );
}
