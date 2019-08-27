import { CONFIG_SET_LANGUAGE } from '../actions/types';

const INITIAL_STATE = {
  language: (navigator.language === 'cs') ? 'cs' : 'en',
};

const configReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CONFIG_SET_LANGUAGE:
      // console.log(action.payload);
      return { ...state, language: action.payload };
    default:
      return state;
  }
};

export default configReducer;
