import { USER_GET_CURRENT, USER_GET_BY_ID, USER_ERROR } from '../actions/types';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"]}] */

const INITIAL_STATE = {
  current: null,
  list: [],
  details: {},
  errorMessage: '', // empty unless an error occurs
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
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
    case USER_ERROR:
      // console.log('USER_ERROR payload:', action.payload);
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

export default userReducer;
