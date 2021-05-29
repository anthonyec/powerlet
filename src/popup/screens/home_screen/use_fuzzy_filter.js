import { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';

export default function useFuzzyFilter(items) {
  const fuseRef = useRef({
    search: () => {}
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fuseRef.current = new Fuse(items, {
      shouldSort: true,
      threshold: 0.6,
      location: 2,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 0,
      keys: ['title']
    });
  }, [items.length]);

  const query = function (searchTerm = '') {
    setSearchTerm(searchTerm);
  };

  const results = (searchTerm && fuseRef.current.search(searchTerm)) || items;

  return [results, query];
}
