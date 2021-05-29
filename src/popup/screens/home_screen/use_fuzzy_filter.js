import { useState } from 'react';
import { fuzzyMatchArray } from './fuzzyMatch';

export default function useFuzzyFilter(items) {
  const [searchTerm, setSearchTerm] = useState('');
  const query = function (searchTerm = '') {
    setSearchTerm(searchTerm);
  };
  const results =
    (searchTerm && fuzzyMatchArray(items, 'title', searchTerm)) || items;

  return [results, query];
}
