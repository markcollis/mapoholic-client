import axios from 'axios';
import {
  AUTH_USER,
  AUTH_ERROR,
} from './types';
import { OMAPFOLDER_SERVER } from '../config';

// Local Actions
// log out current user
export const logoutAction = () => {
  localStorage.removeItem('omapfolder-auth-token');
  return { type: AUTH_USER, payload: null };
};
// cancel a displayed error message
export const cancelAuthErrorAction = () => ({
  type: AUTH_ERROR,
  payload: '',
});

// *** Helper functions ***
// handle errors consistently, for all routes except login
const handleError = errorType => (err, dispatch) => {
  if (err.response) { // received response with an error status code
    if (err.response.data.error) { // expected error message from API
      dispatch({ type: errorType, payload: err.response.data.error });
    } else {
      dispatch({ type: errorType, payload: err.response.data });
    }
  } else if (err.request) { // request made but no response received
    dispatch({ type: errorType, payload: 'No response from server.' });
  } else { // error prior to sending request
    dispatch({ type: errorType, payload: err.message });
  }
};

// create a user account, receive a token in return
// app.post('/users', publicRoute, Authentication.signup);
export const signupAction = (formValues, callback) => async (dispatch) => {
  try {
    const response = await axios.post(`${OMAPFOLDER_SERVER}/users`, formValues);
    dispatch({ type: AUTH_USER, payload: response.data.token });
    localStorage.setItem('omapfolder-auth-token', response.data.token);
    callback(true);
  } catch (err) {
    handleError(AUTH_ERROR)(err, dispatch);
    callback(false);
  }
};

// log in to an existing user account, getting a token in return
// app.post('/users/login', requireLogin, Authentication.login);
export const loginAction = (formValues, callback) => async (dispatch) => {
  try {
    const response = await axios.post(`${OMAPFOLDER_SERVER}/users/login`, formValues);
    dispatch({ type: AUTH_USER, payload: response.data.token });
    localStorage.setItem('omapfolder-auth-token', response.data.token);
    callback(true);
  } catch (err) {
    if (!err.response) {
      dispatch({ type: AUTH_ERROR, payload: 'No response from server.' });
    } else {
      dispatch({ type: AUTH_ERROR, payload: 'Login failed.' }); // no error in response
    }
    callback(false);
  }
};
