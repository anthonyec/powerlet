import React, { useLayoutEffect, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  fetchBookmarklet,
  saveCurrentFile,
  updateCurrentFile,
  deleteCurrentFile,
  fetchAllFolders,
  changeBookmarkletFolder
} from '../../store/actions/editor';

import CodeEditor from '../../components/code_editor';
import TextField from '../../components/text_field';
import Button from '../../components/button';
import Dropdown from '../../components/dropdown';

import './editor_screen.css';

export default function Editor({ route = { params: {}, base: '' } }) {
  const dispatch = useDispatch();
  const currentFile = useSelector((state) => state.editor.currentFile);
  const folders = useSelector((state) => state.editor.folders);

  useLayoutEffect(() => {
    window.document.title = 'Edit script';
  }, []);

  useEffect(() => {
    if (route.params.id) {
      dispatch(fetchBookmarklet(route.params.id));
      dispatch(fetchAllFolders());
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

  const handleOnDeleteClick = () => {
    const deleteScript = confirm(
      'Are you sure you want to delete this script permanently?'
    );

    if (deleteScript) {
      dispatch(deleteCurrentFile());
      window.close();
    }
  };

  const handleOnDoneClick = () => {
    window.close();
  };

  const handleFolderOnChange = (evt) => {
    dispatch(changeBookmarkletFolder(evt.currentTarget.value));
  };

  const folderOptions = folders.map((folder) => {
    return { value: folder.id, label: folder.title };
  });

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
      <div className="editor-screen__section">
        <Dropdown
          onChange={handleFolderOnChange}
          value={currentFile.parentId}
          options={folderOptions}
        />
      </div>
      <div className="editor-screen__section">
        <Button onClick={handleOnDeleteClick}>
          Delete
        </Button>
        <Button onClick={handleOnDoneClick}>Done</Button>
      </div>
    </div>
  );
}
