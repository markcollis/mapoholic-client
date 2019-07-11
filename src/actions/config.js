import {
  CONFIG_SET_LANGUAGE,
} from './types';
/* eslint-disable import/prefer-default-export */

// change language
export const setLanguageAction = (language) => {
  const validLanguages = ['cs', 'en'];
  if (validLanguages.includes(language)) {
    return ({
      type: CONFIG_SET_LANGUAGE,
      payload: language,
    });
  }
  return null;
};
