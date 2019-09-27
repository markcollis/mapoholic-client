import {
  CONFIG_SET_LANGUAGE,
  CONFIG_SET_API_LOGGING,
  ACTIVITY_ERROR,
  ACTIVITY_GOT_ADMIN,
  ACTIVITY_GOT_ALL,
  ACTIVITY_GOT_OWN,
  AUTH_ERROR,
  AUTH_USER,
  CLUB_CREATED,
  CLUB_DELETED,
  CLUB_ERROR,
  CLUB_GOT_LIST,
  CLUB_UPDATED,
  EVENT_COMMENT_ADDED,
  EVENT_COMMENT_DELETED,
  EVENT_COMMENT_UPDATED,
  EVENT_CREATED,
  EVENT_DELETED,
  EVENT_ERROR,
  EVENT_GOT_BY_ID,
  EVENT_GOT_EVENT_LINK_LIST,
  EVENT_GOT_LIST,
  EVENT_GOT_ORIS_LIST,
  EVENT_LINK_CREATED,
  EVENT_LINK_DELETED,
  EVENT_LINK_UPDATED,
  EVENT_MAP_DELETED,
  EVENT_MAP_UPLOADED,
  EVENT_RUNNER_ADDED,
  EVENT_RUNNER_DELETED,
  EVENT_RUNNER_UPDATED,
  EVENT_UPDATED,
  USER_CHANGED_PASSWORD,
  USER_DELETED_IMAGE,
  USER_DELETED,
  USER_ERROR,
  USER_GOT_BY_ID,
  USER_GOT_CURRENT,
  USER_GOT_LIST,
  USER_POSTED_IMAGE,
  USER_UPDATED,
} from '../actions/types';
/* eslint no-console: 0 */

const INITIAL_STATE = {
  language: (navigator.language === 'cs') ? 'cs' : 'en',
  logApiCalls: false,
};

const configReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_USER:
      if (state.logApiCalls) console.log(`${action.type} payload:`, action.payload);
      // return state; // enables API logging to be persistent for debugging
      return INITIAL_STATE; // clear on login or logout
    case CONFIG_SET_LANGUAGE:
      return { ...state, language: action.payload };
    case CONFIG_SET_API_LOGGING:
      return { ...state, logApiCalls: action.payload };
    case USER_GOT_CURRENT:
      if (state.logApiCalls) console.log(`${action.type} payload:`, action.payload);
      // enable API logging if an admin user logs in
      return { ...state, logApiCalls: (action.payload.role === 'admin') };
    // logging for all API calls
    case ACTIVITY_ERROR:
    case ACTIVITY_GOT_ADMIN:
    case ACTIVITY_GOT_ALL:
    case ACTIVITY_GOT_OWN:
    case AUTH_ERROR:
    case CLUB_CREATED:
    case CLUB_DELETED:
    case CLUB_ERROR:
    case CLUB_GOT_LIST:
    case CLUB_UPDATED:
    case EVENT_COMMENT_ADDED:
    case EVENT_COMMENT_DELETED:
    case EVENT_COMMENT_UPDATED:
    case EVENT_CREATED:
    case EVENT_DELETED:
    case EVENT_ERROR:
    case EVENT_GOT_BY_ID:
    case EVENT_GOT_EVENT_LINK_LIST:
    case EVENT_GOT_LIST:
    case EVENT_GOT_ORIS_LIST:
    case EVENT_LINK_CREATED:
    case EVENT_LINK_DELETED:
    case EVENT_LINK_UPDATED:
    case EVENT_MAP_DELETED:
    case EVENT_MAP_UPLOADED:
    case EVENT_RUNNER_ADDED:
    case EVENT_RUNNER_DELETED:
    case EVENT_RUNNER_UPDATED:
    case EVENT_UPDATED:
    case USER_CHANGED_PASSWORD:
    case USER_DELETED_IMAGE:
    case USER_DELETED:
    case USER_ERROR:
    case USER_GOT_BY_ID:
    case USER_GOT_LIST:
    case USER_POSTED_IMAGE:
    case USER_UPDATED:
      if (state.logApiCalls) console.log(`${action.type} payload:`, action.payload);
      return state;
    default:
      return state;
  }
};

export default configReducer;
