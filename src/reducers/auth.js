import { AUTH_USER, AUTH_ERROR } from '../actions/types';

const INITIAL_STATE = {
  authenticated: localStorage.getItem('redux-auth-token'), // empty if not logged in, JWT token if logged in
  errorMessage: '', // empty unless an error occurs
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_USER:
      // console.log(action.payload);
      return { ...state, authenticated: action.payload };
    case AUTH_ERROR:
      // console.log(action.payload);
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

export default authReducer;
