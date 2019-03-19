import axios from 'axios';
import {
  AUTH_USER,
  AUTH_ERROR,
  USER_GET_CURRENT,
  USER_GET_BY_ID,
  USER_ERROR,
} from './types';
import { OMAPFOLDER_SERVER } from '../config';

// *** actions that are functions are enabled by redux-thunk middleware ***

// create a user account, receive a token in return
// app.post('/users', publicRoute, Authentication.signup);
export const signupAction = (formProps, callback) => async (dispatch) => {
  try {
    const response = await axios.post(`${OMAPFOLDER_SERVER}/users`, formProps);
    dispatch({ type: AUTH_USER, payload: response.data.token });
    localStorage.setItem('omapfolder-auth-token', response.data.token);
    callback();
  } catch (err) {
    if (!err.response) {
      dispatch({ type: AUTH_ERROR, payload: 'No response from server.' });
    } else {
      dispatch({ type: AUTH_ERROR, payload: err.response.data.error });
    }
  }
};

// log in to an existing user account, getting a token in return
// app.post('/users/login', requireLogin, Authentication.login);
export const loginAction = (formProps, callback) => async (dispatch) => {
  try {
    const response = await axios.post(`${OMAPFOLDER_SERVER}/login`, formProps);
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

// log out current user - local action only
export const logoutAction = () => {
  localStorage.removeItem('omapfolder-auth-token');
  return { type: AUTH_USER, payload: '' };
};

// reset password of specified user
// app.post('/users/:id/password', requireAuth, Authentication.passwordChange);

// upload profile image for specified user
// app.post('/users/:id/profileImage', requireAuth, Users.validateProfileImagePermission,
// images.uploadImage.single('upload'), Users.postProfileImage, images.errorHandler);

// retrieve a list of all users (ids) matching specified criteria
// app.get('/users', requireAuth, Users.getUserList);
// app.get('/users/public', publicRoute, Users.getUserList);

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
    dispatch({ type: USER_GET_CURRENT, payload: response.data });
    if (callback) callback();
  } catch (err) {
    // console.log('error:', err);
    if (!err.response) {
      dispatch({ type: USER_ERROR, payload: 'No response from server.' });
    } else if (!err.response.data.error) {
      dispatch({ type: USER_ERROR, payload: err.response.data });
    } else {
      dispatch({ type: USER_ERROR, payload: err.response.data.error });
    }
  }
};

// retrieve full details for the specified user
// app.get('/users/public/:id', publicRoute, Users.getUserById);
// app.get('/users/:id', requireAuth, Users.getUserById);
export const getUserByIdAction = (userId, callback) => async (dispatch) => {
  console.log('getUserByIdAction called.');
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    console.log('token:', token);
    let response;
    if (token === '') {
      response = await axios.get(`${OMAPFOLDER_SERVER}/users/public/${userId}`);
    } else {
      response = await axios.get(`${OMAPFOLDER_SERVER}/users/${userId}`, {
        headers: { Authorization: `bearer ${token}` },
      });
    }
    dispatch({ type: USER_GET_BY_ID, payload: response.data });
    if (callback) callback();
  } catch (err) {
    // console.log('error:', err);
    if (!err.response) {
      dispatch({ type: USER_ERROR, payload: 'No response from server.' });
    } else if (!err.response.data.error) {
      dispatch({ type: USER_ERROR, payload: err.response.data });
    } else {
      dispatch({ type: USER_ERROR, payload: err.response.data.error });
    }
  }
};

// update the specified user (multiple amendment not supported)
// app.patch('/users/:id', requireAuth, Users.updateUser);

// delete the specified user (multiple deletion not supported)
// app.delete('/users/:id', requireAuth, Users.deleteUser);

// delete profile image of the specified user
// app.delete('/users/:id/profileImage', requireAuth, Users.deleteProfileImage)
