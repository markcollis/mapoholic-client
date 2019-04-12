import {
  AUTH_USER,
  USER_GOT_LIST,
  USER_GOT_CURRENT,
  USER_GOT_BY_ID,
  USER_GOT_EVENTS,
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
  USER_SELECT_USER_EVENT,
} from '../actions/types';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"]}] */

const INITIAL_STATE = {
  searchField: '', // contents of search box in UserFilter
  list: null, // replaced each time API is queried
  current: null, // matches auth token in localStorage
  viewMode: 'none', // configuration of right column: none, view, edit, delete
  viewModeSelf: 'view', // configuration of own profile page: view, edit, delete
  details: {}, // all user records viewed, key is userId
  selectedUserId: '', // userId of user to display in UserDetails
  eventLists: {}, // all event list records viewed, key is userId
  selectedEvent: '', // selected event to show details of (eventId)
  errorMessage: '', // empty unless an error occurs
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_USER:
      // console.log('AUTH_USER payload:', action.payload);
      return INITIAL_STATE; // clear on login or logout
    case USER_GOT_LIST:
      // console.log('USER_GOT_LIST payload:', action.payload);
      return {
        ...state,
        list: action.payload,
        errorMessage: '',
      };
    case USER_GOT_CURRENT:
      // console.log('USER_GET_CURRENT payload:', action.payload);
      return {
        ...state,
        current: action.payload,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
      };
    case USER_GOT_BY_ID:
      // console.log('USER_GOT_BY_ID payload:', action.payload);
      return {
        ...state,
        current: (state.current._id === action.payload._id) ? action.payload : { ...state.current },
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
      };
    case USER_GOT_EVENTS:
      // console.log('USER_GOT_EVENTS payload:', action.payload);
      return {
        ...state,
        eventLists: { ...state.eventLists, [action.payload.userId]: action.payload.eventList },
        errorMessage: '',
      };
    case USER_UPDATED:
      // console.log('USER_UPDATED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
      };
    case USER_POSTED_IMAGE:
      // console.log('USER_POSTED_IMAGE payload:', action.payload);
      return {
        ...state,
        list: [...state.list].map((user) => {
          if (user.user_id && user.user_id === action.payload.userId) {
            return { ...user, profileImage: action.payload.profileImage };
          }
          return user;
        }),
        current: (state.current._id === action.payload.userId)
          // ? { ...state.current, profileImage: '' }
          ? { ...state.current, profileImage: action.payload.profileImage }
          : { ...state.current },
        details: {
          ...state.details,
          [action.payload.userId]: {
            // ...state.details[action.payload.userId], profileImage: '',
            ...state.details[action.payload.userId], profileImage: action.payload.profileImage,
          },
        },
        errorMessage: '',
      };
    case USER_CHANGED_PASSWORD:
      // console.log('USER_CHANGED_PASSWORD payload:', action.payload);
      return state;
    case USER_DELETED:
    // console.log('USER_DELETED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: null },
        selectedUserId: '',
        errorMessage: '',
      };
    case USER_DELETED_IMAGE:
    // console.log('USER_DELETED_IMAGE payload:', action.payload);
      return {
        ...state,
        list: [...state.list].map((user) => {
          if (user.user_id && user.user_id === action.payload) {
            return { ...user, profileImage: '' };
          }
          return user;
        }),
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
      // console.log('USER_ERROR payload:', action.payload);
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
    case USER_SELECT_USER_EVENT:
      // console.log('USER_SELECT_USER_EVENT payload:', action.payload);
      return { ...state, selectedEvent: action.payload };
    default:
      return state;
  }
};

export default userReducer;
