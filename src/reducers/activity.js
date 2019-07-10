import {
  AUTH_USER,
  ACTIVITY_GOT_ADMIN,
  ACTIVITY_GOT_ALL,
  ACTIVITY_GOT_OWN,
  ACTIVITY_ERROR,
} from '../actions/types';
import { logAPICalls } from '../config';

const INITIAL_STATE = {
  activityAdmin: null, // replaced each time API is queried
  activityAll: null, // replaced each time API is queried
  activityOwn: null, // replaced each time API is queried
  errorMessage: '', // empty unless an error occurs
};

const activityReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_USER:
      // console.log('AUTH_USER payload:', action.payload);
      return INITIAL_STATE; // clear on login or logout
    case ACTIVITY_GOT_ADMIN:
      if (logAPICalls) console.log('ACTIVITY_GOT_ADMIN payload:', action.payload);
      return {
        ...state,
        errorMessage: '',
        activityAdmin: action.payload,
      };
    case ACTIVITY_GOT_ALL:
      if (logAPICalls) console.log('ACTIVITY_GOT_ALL payload:', action.payload);
      return {
        ...state,
        errorMessage: '',
        activityAll: action.payload,
      };
    case ACTIVITY_GOT_OWN:
      if (logAPICalls) console.log('ACTIVITY_GOT_OWN payload:', action.payload);
      return {
        ...state,
        errorMessage: '',
        activityOwn: action.payload,
      };
    case ACTIVITY_ERROR:
      if (logAPICalls) console.log('ACTIVITY_ERROR payload:', action.payload);
      return {
        ...state,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

export default activityReducer;
