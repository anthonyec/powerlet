import { useSelector } from 'react-redux';

import { selectTranslations } from '../store/selectors/locale';

export function useTranslations() {
  const translations = useSelector(selectTranslations);

  return {
    get: (key, searchValue = '', replaceValue = '') => {
      const value = translations[key];

      if (searchValue && replaceValue && value) {
        return value.replace(searchValue, replaceValue);
      }

      return value;
    }
  };
}
