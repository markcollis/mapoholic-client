import {
  AUTH_USER,
  USER_GET_CURRENT,
  USER_GET_BY_ID,
  USER_GET_LIST,
  USER_ERROR,
  USER_CHANGE_SEARCH_FIELD,
  USER_SELECT_USER,
} from '../actions/types';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"]}] */

const INITIAL_STATE = {
  current: null, // matches auth token in localStorage
  details: {}, // all user records viewed, key is userId
  toDisplay: '', // userId of user to display in UserDetails
  list: null, // replaced each time API is queried
  searchField: '', // contents of search box in UserFilter
  errorMessage: '', // empty unless an error occurs
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_USER:
      // console.log('AUTH_USER payload:', action.payload);
      // if (action.payload === '') { // clear user state on logout
      return INITIAL_STATE; // clear on login or logout
      // }
      // return { ...state };
    case USER_GET_CURRENT:
      // console.log('USER_GET_CURRENT payload:', action.payload);
      return {
        ...state,
        current: action.payload,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
      };
    case USER_GET_BY_ID:
      // console.log('USER_GET_BY_ID payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
      };
    case USER_GET_LIST:
      // console.log('USER_GET_LIST payload:', action.payload);
      return {
        ...state,
        list: action.payload,
        errorMessage: '',
      };
    case USER_ERROR:
      // console.log('USER_ERROR payload:', action.payload);
      return { ...state, errorMessage: action.payload };
    case USER_CHANGE_SEARCH_FIELD:
      // console.log('USER_CHANGE_SEARCH_FIELD payload:', action.payload);
      return { ...state, searchField: action.payload };
    case USER_SELECT_USER:
      // console.log('USER_SELECT_USER payload:', action.payload);
      return { ...state, toDisplay: action.payload };
    default:
      return state;
  }
};

export default userReducer;
