import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchAllBookmarklets, executeBookmarklet } from './store/actions/bookmarklets';

import './reset.css';
import './app.css';

export default function App() {
  const inputEl = useRef(null);
  const bookmarklets = useSelector((state) => state.bookmarklets.all)
  const dispatch = useDispatch();

  useEffect(() => {
    inputEl.current.focus();

    dispatch(fetchAllBookmarklets());
  }, []);

  const handleBookmarkletClick = (url) => {
    dispatch(executeBookmarklet(url));
  };

  return (
    <div className="app">
      <input ref={inputEl} />

      <ul className="search-list">
        {bookmarklets.map((bookmarklet) => {
          return (
            <li
              key={bookmarklet.id}
              className="search-list__item"
              onClick={handleBookmarkletClick.bind(null, bookmarklet.url)}
            >
              {bookmarklet.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
