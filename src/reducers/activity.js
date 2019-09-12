import {
  AUTH_USER,
  ACTIVITY_GOT_ADMIN,
  ACTIVITY_GOT_ALL,
  ACTIVITY_GOT_OWN,
  ACTIVITY_ERROR,
  CLUB_CREATED,
  CLUB_UPDATED,
  CLUB_DELETED,
  EVENT_CREATED,
  EVENT_UPDATED,
  EVENT_DELETED,
  EVENT_MAP_UPLOADED,
  EVENT_MAP_DELETED,
  EVENT_RUNNER_ADDED,
  EVENT_RUNNER_UPDATED,
  EVENT_RUNNER_DELETED,
  EVENT_COMMENT_ADDED,
  EVENT_COMMENT_UPDATED,
  EVENT_COMMENT_DELETED,
  EVENT_LINK_CREATED,
  EVENT_LINK_UPDATED,
  EVENT_LINK_DELETED,
  USER_UPDATED,
  USER_CHANGED_PASSWORD,
  USER_POSTED_IMAGE,
  USER_DELETED_IMAGE,
  USER_DELETED,
} from '../actions/types';
import { LOG_API_CALLS } from '../config';
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */

const INITIAL_STATE = {
  activityAdmin: null, // replaced each time API is queried
  activityAll: null, // replaced each time API is queried
  activityOwn: null, // replaced each time API is queried
  activitySession: [], // user's own activity in this current session
  errorMessage: '', // empty unless an error occurs
};

const activityReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_USER:
      // console.log('AUTH_USER payload:', action.payload);
      return INITIAL_STATE; // clear on login or logout
    case ACTIVITY_GOT_ADMIN:
      if (LOG_API_CALLS) console.log('ACTIVITY_GOT_ADMIN payload:', action.payload);
      return {
        ...state,
        errorMessage: '',
        activityAdmin: action.payload,
        activitySession: [], // clear to avoid duplicates
      };
    case ACTIVITY_GOT_ALL:
      if (LOG_API_CALLS) console.log('ACTIVITY_GOT_ALL payload:', action.payload);
      return {
        ...state,
        errorMessage: '',
        activityAll: action.payload,
        activitySession: [], // clear to avoid duplicates
      };
    case ACTIVITY_GOT_OWN:
      if (LOG_API_CALLS) console.log('ACTIVITY_GOT_OWN payload:', action.payload);
      return {
        ...state,
        errorMessage: '',
        activityOwn: action.payload,
        activitySession: [], // clear to avoid duplicates
      };
    case ACTIVITY_ERROR:
      if (LOG_API_CALLS) console.log('ACTIVITY_ERROR payload:', action.payload);
      return {
        ...state,
        errorMessage: action.payload,
      };
    case CLUB_CREATED:
    case CLUB_UPDATED:
    case CLUB_DELETED: {
      // if (LOG_API_CALLS) console.log('CLUB_* payload:', action.payload);
      const newActivity = {
        actionType: action.type,
        timestamp: new Date(),
        club: {
          active: !(action.type === 'CLUB_DELETED'),
          _id: action.payload._id,
          shortName: action.payload.shortName,
        },
      };
      return {
        ...state,
        activitySession: [newActivity, ...state.activitySession],
      };
    }
    case EVENT_CREATED:
    case EVENT_UPDATED:
    case EVENT_DELETED:
    case EVENT_RUNNER_ADDED:
    case EVENT_RUNNER_UPDATED:
    case EVENT_RUNNER_DELETED: {
      // if (LOG_API_CALLS) console.log('EVENT_(RUNNER_)* payload:', action.payload);
      const newActivity = { // eventRunner can not be identified from payload
        actionType: action.type,
        timestamp: new Date(),
        event: {
          active: !(action.type === 'EVENT_DELETED'),
          _id: action.payload._id,
          date: action.payload.date,
          name: action.payload.name,
        },
      };
      return {
        ...state,
        activitySession: [newActivity, ...state.activitySession],
      };
    }
    case EVENT_MAP_UPLOADED:
    case EVENT_MAP_DELETED: {
      // if (LOG_API_CALLS) console.log('EVENT_MAP_* payload:', action.payload);
      const newActivity = {
        actionType: action.type,
        timestamp: new Date(),
        event: {
          active: true,
          _id: action.payload.parameters.eventId,
          date: action.payload.updatedEvent.date,
          name: action.payload.updatedEvent.name,
        },
        eventRunner: action.payload.updatedEvent.runners.find((runner) => {
          return (runner.user._id === action.payload.parameters.userId);
        }),
      };
      return {
        ...state,
        activitySession: [newActivity, ...state.activitySession],
      };
    }
    case EVENT_COMMENT_ADDED:
    case EVENT_COMMENT_UPDATED:
    case EVENT_COMMENT_DELETED: {
      const commentActionTypes = {
        EVENT_COMMENT_ADDED: 'COMMENT_POSTED',
        EVENT_COMMENT_UPDATED: 'COMMENT_UPDATED',
        EVENT_COMMENT_DELETED: 'COMMENT_DELETED',
      };
      // if (LOG_API_CALLS) console.log('EVENT_COMMENT_* payload:', action.payload);
      const newActivity = { // commentId can not be identified from payload
        actionType: commentActionTypes[action.type],
        timestamp: new Date(),
        eventId: action.payload.eventId, // need to map to event later
        runnerId: action.payload.userId, // need to map to user later
      };
      return {
        ...state,
        activitySession: [newActivity, ...state.activitySession],
      };
    }
    case EVENT_LINK_CREATED:
    case EVENT_LINK_UPDATED:
    case EVENT_LINK_DELETED: {
      // if (LOG_API_CALLS) console.log('EVENT_LINK_* payload:', action.payload);
      const newActivity = {
        actionType: action.type,
        timestamp: new Date(),
        eventLink: {
          _id: action.payload._id,
          displayName: action.payload.displayName,
        },
      };
      return {
        ...state,
        activitySession: [newActivity, ...state.activitySession],
      };
    }
    case USER_UPDATED:
    case USER_DELETED: {
      // if (LOG_API_CALLS) console.log('USER_* payload:', action.payload);
      const newActivity = {
        actionType: action.type,
        timestamp: new Date(),
        user: { ...action.payload, active: !(action.type === 'USER_DELETED') },
      };
      return {
        ...state,
        activitySession: [newActivity, ...state.activitySession],
      };
    }
    case USER_CHANGED_PASSWORD: {
      // if (LOG_API_CALLS) console.log('USER_CHANGED_PASSWORD payload:', action.payload);
      const newActivity = {
        actionType: 'USER_UPDATED',
        timestamp: new Date(),
        user: { ...action.payload, active: true },
      };
      return {
        ...state,
        activitySession: [newActivity, ...state.activitySession],
      };
    }
    case USER_POSTED_IMAGE: {
      // if (LOG_API_CALLS) console.log('USER_POSTED_IMAGE payload:', action.payload);
      const newActivity = {
        actionType: 'USER_UPDATED',
        timestamp: new Date(),
        userId: action.payload.userId,
        // user: { ...action.payload, active: true },
      };
      return {
        ...state,
        activitySession: [newActivity, ...state.activitySession],
      };
    }
    case USER_DELETED_IMAGE: {
      // if (LOG_API_CALLS) console.log('USER_DELETED_IMAGE payload:', action.payload);
      const newActivity = {
        actionType: 'USER_UPDATED',
        timestamp: new Date(),
        userId: action.payload,
        // user: { ...action.payload, active: true },
      };
      return {
        ...state,
        activitySession: [newActivity, ...state.activitySession],
      };
    }
    default:
      return state;
  }
};

export default activityReducer;
