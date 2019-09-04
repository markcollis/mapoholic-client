import {
  AUTH_USER,
  USER_GOT_LIST,
  USER_GOT_CURRENT,
  USER_GOT_BY_ID,
  // USER_GOT_EVENTS,
  USER_UPDATED,
  USER_POSTED_IMAGE,
  USER_CHANGED_PASSWORD,
  USER_DELETED,
  USER_DELETED_IMAGE,
  USER_ERROR,
  USER_CHANGE_SEARCH_FIELD,
  USER_CHANGE_VIEW_MODE,
  USER_CHANGE_VIEW_MODE_SELF,
  USER_SELECT_USER,
} from '../actions/types';
import { LOG_API_CALLS } from '../config';
/* eslint-disable no-console */
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"]}] */

// update user list as necessary for all actions that receive full details of an updated user
const getUpdatedUserList = (list, payload) => {
  if (!list) return null;
  const newList = list.map((listedUser) => {
    if (listedUser._id === payload._id) {
      const {
        _id,
        displayName,
        fullName,
        memberOf,
        profileImage,
        role,
        createdAt,
      } = payload;
      const userSummary = {
        _id,
        displayName,
        fullName,
        memberOf,
        profileImage,
        role,
        joined: createdAt,
      };
      return userSummary;
    }
    return listedUser;
  });
  // console.log('newList:', newList);
  return newList;
};

// remove a specific item from a list after deletion
const removeFromListById = (list, id) => {
  if (!list) return null;
  const newList = list.filter(listItem => listItem._id !== id);
  return newList;
};

const INITIAL_STATE = {
  searchField: '', // contents of search box in UserFilter
  list: null, // replaced each time API is queried
  current: null, // matches auth token in localStorage
  viewMode: 'none', // configuration of right column: none, view, edit, delete
  viewModeSelf: 'view', // configuration of own profile page: view, edit, delete
  details: {}, // all user records viewed, key is userId
  selectedUserId: '', // userId of user to display in UserDetails
  errorMessage: '', // empty unless an error occurs
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_USER:
      // console.log('AUTH_USER payload:', action.payload);
      return INITIAL_STATE; // clear on login or logout
    case USER_GOT_LIST:
      if (LOG_API_CALLS) console.log('USER_GOT_LIST payload:', action.payload);
      return {
        ...state,
        list: action.payload,
        errorMessage: '',
      };
    case USER_GOT_CURRENT:
      if (LOG_API_CALLS) console.log('USER_GOT_CURRENT payload:', action.payload);
      return {
        ...state,
        current: action.payload,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
      };
    case USER_GOT_BY_ID:
      if (LOG_API_CALLS) console.log('USER_GOT_BY_ID payload:', action.payload);
      return {
        ...state,
        current: (state.current._id === action.payload._id) ? action.payload : { ...state.current },
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
      };
    case USER_UPDATED:
      if (LOG_API_CALLS) console.log('USER_UPDATED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
        list: getUpdatedUserList(state.list, action.payload),
      };
    case USER_POSTED_IMAGE:
      if (LOG_API_CALLS) console.log('USER_POSTED_IMAGE payload:', action.payload);
      return {
        ...state,
        list: (state.list)
          ? state.list.map((user) => {
            if (user._id && user._id === action.payload.userId) {
              return { ...user, profileImage: action.payload.profileImage };
            }
            return user;
          })
          : null,
        current: (state.current._id === action.payload.userId)
          ? { ...state.current, profileImage: action.payload.profileImage }
          : { ...state.current },
        details: {
          ...state.details,
          [action.payload.userId]: {
            ...state.details[action.payload.userId], profileImage: action.payload.profileImage,
          },
        },
        errorMessage: '',
      };
    case USER_CHANGED_PASSWORD:
      if (LOG_API_CALLS) console.log('USER_CHANGED_PASSWORD payload:', action.payload);
      return state;
    case USER_DELETED:
      if (LOG_API_CALLS) console.log('USER_DELETED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: null },
        list: removeFromListById(state.list, action.payload._id),
        selectedUserId: '',
        errorMessage: '',
      };
    case USER_DELETED_IMAGE:
      if (LOG_API_CALLS) console.log('USER_DELETED_IMAGE payload:', action.payload);
      return {
        ...state,
        list: (state.list)
          ? state.list.map((user) => {
            if (user._id && user._id === action.payload) {
              return { ...user, profileImage: '' };
            }
            return user;
          })
          : null,
        current: (state.current._id === action.payload)
          ? { ...state.current, profileImage: '' }
          : { ...state.current },
        details: {
          ...state.details,
          [action.payload]: {
            ...state.details[action.payload], profileImage: '',
          },
        },
        errorMessage: '',
      };
    case USER_ERROR:
      if (LOG_API_CALLS) console.log('USER_ERROR payload:', action.payload);
      return { ...state, errorMessage: action.payload };
    case USER_CHANGE_SEARCH_FIELD:
      // console.log('USER_CHANGE_SEARCH_FIELD payload:', action.payload);
      return { ...state, searchField: action.payload };
    case USER_CHANGE_VIEW_MODE:
      // console.log('USER_CHANGE_VIEW_MODE payload:', action.payload);
      return { ...state, viewMode: action.payload };
    case USER_CHANGE_VIEW_MODE_SELF:
      // console.log('USER_CHANGE_VIEW_MODE_SELF payload:', action.payload);
      return { ...state, viewModeSelf: action.payload };
    case USER_SELECT_USER:
      // console.log('USER_SELECT_USER payload:', action.payload);
      return { ...state, selectedUserId: action.payload };
    default:
      return state;
  }
};

export default userReducer;
