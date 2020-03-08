import React, { useLayoutEffect, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchBookmarklet } from '../../store/actions/editor';

import './editor.css';

export default function Editor({ route = { params: {}, base: ''} }) {
  const dispatch = useDispatch();
  const script = useSelector((state) => state.editor.openScript);

  useLayoutEffect(() => {
    window.document.title = 'Script Editor';
  }, []);

  useEffect(() => {
    if (route.params.id) {
      dispatch(fetchBookmarklet(route.params.id));
    }
  }, [route.params.id]);

  return (
    <div className="editor-screen">
      <input type="text" value={script.title}/>
      <br />
      <textarea cols="30" rows="10" value={script.code} />
    </div>
  );
}
