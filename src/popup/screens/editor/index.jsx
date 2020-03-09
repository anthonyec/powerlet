import React, { useLayoutEffect, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchBookmarklet } from '../../store/actions/editor';

import './editor.css';

export default function Editor({ route = { params: {}, base: ''} }) {
  const dispatch = useDispatch();
  const currentFile = useSelector((state) => state.editor.currentFile);

  useLayoutEffect(() => {
    window.document.title = 'Edit Script';
  }, []);

  useEffect(() => {
    if (route.params.id) {
      dispatch(fetchBookmarklet(route.params.id));
    }
  }, [route.params.id]);

  return (
    <div className="editor-screen">
      <input type="text" value={currentFile && currentFile.title}/>
      <br />
      <textarea cols="60" rows="20" value={currentFile && currentFile.code} />
    </div>
  );
}
