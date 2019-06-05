import { AUTH_USER, AUTH_ERROR } from '../actions/types';

const INITIAL_STATE = {
  authenticated: localStorage.getItem('omapfolder-auth-token'), // null if not logged in, JWT token if logged in
  errorMessage: '', // empty unless an error occurs
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_USER:
      // console.log('AUTH_USER with:', action.payload);
      // console.log('auth:', state);
      return { ...state, authenticated: action.payload, errorMessage: '' };
    case AUTH_ERROR:
      // console.log(action.payload);
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

export default authReducer;
