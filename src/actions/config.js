import {
  CONFIG_SET_LANGUAGE,
} from './types';

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

export const another = 'another'; // avoid export default warning until another is needed
