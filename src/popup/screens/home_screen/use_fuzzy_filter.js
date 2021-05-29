import { useState } from 'react';
import { fuzzyMatchArray } from './fuzzy_match';

export default function useFuzzyFilter(items) {
  const [searchTerm, setSearchTerm] = useState('');
  const query = function (searchTerm = '') {
    setSearchTerm(searchTerm);
  };
  const results =
    (searchTerm && fuzzyMatchArray(items, 'title', searchTerm)) || items;

  return [results, query];
}
