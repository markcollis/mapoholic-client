import {
  CONFIG_SET_LANGUAGE,
  CONFIG_SET_API_LOGGING,
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

export const setApiLoggingAction = (loggingEnabled) => {
  if (typeof loggingEnabled === 'boolean') {
    return ({
      type: CONFIG_SET_API_LOGGING,
      payload: loggingEnabled,
    });
  }
  return null;
};
