import axios from 'axios';
import {
  AUTH_USER,
  AUTH_ERROR,
  USER_GET_CURRENT,
  USER_GET_BY_ID,
  USER_GET_LIST,
  USER_ERROR,
  USER_CHANGE_SEARCH_FIELD,
  USER_SELECT_USER,
} from './types';
import { OMAPFOLDER_SERVER } from '../config';

// Local Actions
// log out current user
export const logoutAction = () => {
  localStorage.removeItem('omapfolder-auth-token');
  return { type: AUTH_USER, payload: '' };
};
// track changes to the user search field
export const setUserSearchFieldAction = text => ({
  type: USER_CHANGE_SEARCH_FIELD,
  payload: text,
});
// select a user to show further information
export const selectUserToDisplayAction = userId => ({
  type: USER_SELECT_USER,
  payload: userId,
});

// *** actions that are functions are enabled by redux-thunk middleware ***

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
// convert a (shallow) object to a query string
const toQueryString = (obj) => {
  return '?'.concat(Object.keys(obj).map((key) => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
  }).join('&'));
};

// create a user account, receive a token in return
// app.post('/users', publicRoute, Authentication.signup);
export const signupAction = (formValues, callback) => async (dispatch) => {
  try {
    const response = await axios.post(`${OMAPFOLDER_SERVER}/users`, formValues);
    dispatch({ type: AUTH_USER, payload: response.data.token });
    localStorage.setItem('omapfolder-auth-token', response.data.token);
    callback();
  } catch (err) {
    handleError(AUTH_ERROR)(err, dispatch);
  }
};

// log in to an existing user account, getting a token in return
// app.post('/users/login', requireLogin, Authentication.login);
export const loginAction = (formValues, callback) => async (dispatch) => {
  try {
    const response = await axios.post(`${OMAPFOLDER_SERVER}/login`, formValues);
    dispatch({ type: AUTH_USER, payload: response.data.token });
    localStorage.setItem('omapfolder-auth-token', response.data.token);
    callback();
  } catch (err) {
    if (!err.response) {
      dispatch({ type: AUTH_ERROR, payload: 'No response from server.' });
    } else {
      dispatch({ type: AUTH_ERROR, payload: 'Login failed.' }); // no error in response
    }
  }
};


// reset password of specified user
// app.post('/users/:id/password', requireAuth, Authentication.passwordChange);

// upload profile image for specified user
// app.post('/users/:id/profileImage', requireAuth, Users.validateProfileImagePermission,
// images.uploadImage.single('upload'), Users.postProfileImage, images.errorHandler);

// retrieve a list of all users (ids) matching specified criteria
// app.get('/users', requireAuth, Users.getUserList);
// app.get('/users/public', publicRoute, Users.getUserList);
export const getUserListAction = (searchCriteria, callback) => async (dispatch) => {
  const queryString = (searchCriteria) ? toQueryString(searchCriteria) : '';
  // console.log('getUserListAction called.');
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    // console.log('token:', token);
    let response;
    if (token) {
      response = await axios.get(`${OMAPFOLDER_SERVER}/users${queryString}`, {
        headers: { Authorization: `bearer ${token}` },
      });
    } else {
      response = await axios.get(`${OMAPFOLDER_SERVER}/users/public${queryString}`);
    }
    dispatch({ type: USER_GET_LIST, payload: [...response.data, queryString] });
    if (callback) callback();
  } catch (err) {
    handleError(USER_ERROR)(err, dispatch);
  }
};

// retrieve full details for the currently logged in user
// app.get('/users/me', requireAuth, Users.getLoggedInUser);
export const getCurrentUserAction = callback => async (dispatch) => {
  // console.log('getCurrentUserAction called.');
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    // console.log('token:', token);
    const response = await axios.get(`${OMAPFOLDER_SERVER}/users/me`, {
      headers: { Authorization: `bearer ${token}` },
    });
    // console.log('response:', response.data);
    dispatch({ type: USER_GET_CURRENT, payload: response.data });
    if (callback) callback();
  } catch (err) {
    handleError(USER_ERROR)(err, dispatch);
  }
};

// retrieve full details for the specified user
// app.get('/users/public/:id', publicRoute, Users.getUserById);
// app.get('/users/:id', requireAuth, Users.getUserById);
export const getUserByIdAction = (userId, callback) => async (dispatch) => {
  // console.log('getUserByIdAction called.');
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    // console.log('token:', token);
    let response;
    if (token) {
      // console.log('logged in route with token');
      response = await axios.get(`${OMAPFOLDER_SERVER}/users/${userId}`, {
        headers: { Authorization: `bearer ${token}` },
      });
    } else {
      // console.log('public route');
      response = await axios.get(`${OMAPFOLDER_SERVER}/users/public/${userId}`);
    }
    // console.log('response:', response.data);
    dispatch({ type: USER_GET_BY_ID, payload: response.data });
    if (callback) callback();
  } catch (err) {
    handleError(USER_ERROR)(err, dispatch);
  }
};

// update the specified user (multiple amendment not supported)
// app.patch('/users/:id', requireAuth, Users.updateUser);

// delete the specified user (multiple deletion not supported)
// app.delete('/users/:id', requireAuth, Users.deleteUser);

// delete profile image of the specified user
// app.delete('/users/:id/profileImage', requireAuth, Users.deleteProfileImage)
