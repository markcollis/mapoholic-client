import { AUTH_USER, AUTH_ERROR } from '../actions/types';
import { AuthState, AuthAction } from '../types/auth';

const INITIAL_STATE: AuthState = {
  authenticated: localStorage.getItem('mapoholic-auth-token'), // null if not logged in, JWT token if logged in
  errorMessage: '', // empty unless an error occurs
};

const authReducer = (state: AuthState = INITIAL_STATE, action: AuthAction): AuthState => {
  switch (action.type) {
    case AUTH_USER:
      return { ...state, authenticated: action.payload, errorMessage: '' };
    case AUTH_ERROR:
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

export default authReducer;
