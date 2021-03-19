import React, { useLayoutEffect, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  fetchBookmarklet,
  changeBookmarkletFolder,
  deleteBookmarklet,
  saveCurrentFile,
  updateCurrentFile,
  fetchAllFolders
} from '../../store/actions/editor';

import CodeEditor from '../../components/code_editor';
import TextField from '../../components/text_field';
import Button from '../../components/button';
import Dropdown from '../../components/dropdown';

import './editor_screen.css';

export default function Editor({ route = { params: {}, base: '' } }) {
  const dispatch = useDispatch();
  const translations = useSelector((state) => state.locale.messages);
  const currentFile = useSelector((state) => state.editor.currentFile);
  const folders = useSelector((state) => state.editor.folders);

  useLayoutEffect(() => {
    window.document.title = translations['edit_script_title'];
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
      translations['delete_script_confirmation_message']
    );

    if (deleteScript) {
      dispatch(deleteBookmarklet(currentFile.id));
      window.close();
    }
  };

  const handleOnDoneClick = () => {
    window.close();
  };

  const handleFolderOnChange = (evt) => {
    dispatch(changeBookmarkletFolder(currentFile.id, evt.currentTarget.value));
  };

  const folderOptions = folders.map((folder) => {
    return { value: folder.id, label: folder.title };
  });

  return (
    <div className="editor-screen">
      <div className="editor-screen__section">
        <TextField
          label={translations['name_label']}
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
      <div className="editor-screen__section editor-screen__section--space-between">
        <Button onClick={handleOnDeleteClick}>
          {translations['delete_button']}
        </Button>
        <Button onClick={handleOnDoneClick}>
          {translations['done_button']}
        </Button>
      </div>
    </div>
  );
}
