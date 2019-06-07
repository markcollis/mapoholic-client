import axios from 'axios';
import {
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
} from './types';
import { OMAPFOLDER_SERVER } from '../config';
/* eslint no-underscore-dangle: ["error", { "allow": ["_boundary"]}] */


// *** Local Actions ***
// change user view mode
export const setUserViewModeAction = (mode) => {
  const validModes = ['none', 'view', 'edit', 'delete'];
  if (validModes.includes(mode)) {
    return ({
      type: USER_CHANGE_VIEW_MODE,
      payload: mode,
    });
  }
  return null;
};
// change user view mode for own profile
export const setUserViewModeSelfAction = (mode) => {
  const validModes = ['view', 'edit', 'delete'];
  if (validModes.includes(mode)) {
    return ({
      type: USER_CHANGE_VIEW_MODE_SELF,
      payload: mode,
    });
  }
  // console.log('Warning: Invalid user view mode! There\'s a typo somewhere', mode);
  return null;
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
// cancel a displayed error message
export const cancelUserErrorAction = () => ({
  type: USER_ERROR,
  payload: '',
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

// *** API actions ***
// reset password of specified user
// app.post('/users/:id/password', requireAuth, Authentication.passwordChange);
export const changePasswordAction = (userId, formValues, callback) => {
  return async (dispatch, getState) => {
    const state = getState();
    const { auth } = state;
    try {
      const token = auth.authenticated;
      const response = await axios.post(`${OMAPFOLDER_SERVER}/users/${userId}/password`, formValues, {
        headers: { Authorization: `bearer ${token}` },
      });
      dispatch({ type: USER_CHANGED_PASSWORD, payload: response.data });
      if (callback) callback(true);
    } catch (err) {
      handleError(USER_ERROR)(err, dispatch);
      if (callback) callback(false);
    }
  };
};

// upload profile image for specified user
// app.post('/users/:id/profileImage', requireAuth, Users.validateProfileImagePermission,
// images.uploadImage.single('upload'), Users.postProfileImage, images.errorHandler);
export const postProfileImageAction = (userId, file, callback) => async (dispatch, getState) => {
  const state = getState();
  const { auth } = state;
  try {
    const now = new Date();
    const formData = new FormData();
    formData.append('upload', file, file.name);
    const token = auth.authenticated;
    const response = await axios.post(`${OMAPFOLDER_SERVER}/users/${userId}/profileImage`, formData, {
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    });
    dispatch({
      type: USER_POSTED_IMAGE,
      payload: {
        userId,
        profileImage: `${response.data}?${now.getTime()}`,
      },
    });
    if (callback) callback(true);
  } catch (err) {
    handleError(USER_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// retrieve a list of all users (ids) matching specified criteria
// app.get('/users', requireAuth, Users.getUserList);
// app.get('/users/public', publicRoute, Users.getUserList);
export const getUserListAction = (searchCriteria, callback) => async (dispatch, getState) => {
  const state = getState();
  const { auth } = state;
  const queryString = (searchCriteria) ? toQueryString(searchCriteria) : '';
  try {
    const token = auth.authenticated;
    let response;
    if (token) {
      response = await axios.get(`${OMAPFOLDER_SERVER}/users${queryString}`, {
        headers: { Authorization: `bearer ${token}` },
      });
    } else {
      response = await axios.get(`${OMAPFOLDER_SERVER}/users/public${queryString}`);
    }
    dispatch({ type: USER_GOT_LIST, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(USER_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// retrieve full details for the currently logged in user
// app.get('/users/me', requireAuth, Users.getLoggedInUser);
export const getCurrentUserAction = callback => async (dispatch, getState) => {
  const state = getState();
  const { auth } = state;
  try {
    const token = auth.authenticated;
    const response = await axios.get(`${OMAPFOLDER_SERVER}/users/me`, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: USER_GOT_CURRENT, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(USER_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// retrieve full details for the specified user
// app.get('/users/public/:id', publicRoute, Users.getUserById);
// app.get('/users/:id', requireAuth, Users.getUserById);
export const getUserByIdAction = (userId, callback) => async (dispatch, getState) => {
  const state = getState();
  const { auth } = state;
  try {
    const token = auth.authenticated;
    let response;
    if (token) {
      response = await axios.get(`${OMAPFOLDER_SERVER}/users/${userId}`, {
        headers: { Authorization: `bearer ${token}` },
      });
    } else {
      response = await axios.get(`${OMAPFOLDER_SERVER}/users/public/${userId}`);
    }
    dispatch({ type: USER_GOT_BY_ID, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(USER_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// get a list of events attended by the specified user (need to check when maps are present!)
export const getUserEventsAction = (userId, callback) => async (dispatch, getState) => {
  if (!userId) {
    dispatch({ type: USER_ERROR, payload: 'No user specified.' });
  } else {
    const state = getState();
    const { auth } = state;
    const queryString = toQueryString({ runners: userId });
    try {
      const token = auth.authenticated;
      let response;
      if (token) {
        response = await axios.get(`${OMAPFOLDER_SERVER}/events${queryString}`, {
          headers: { Authorization: `bearer ${token}` },
        });
      } else {
        response = await axios.get(`${OMAPFOLDER_SERVER}/events/public${queryString}`);
      }
      dispatch({
        type: USER_GOT_EVENTS,
        payload: {
          userId,
          eventList: response.data,
        },
      });
      if (callback) callback(true);
    } catch (err) {
      handleError(USER_ERROR)(err, dispatch);
      if (callback) callback(false);
    }
  }
};

// update the specified user (multiple amendment not supported)
// app.patch('/users/:id', requireAuth, Users.updateUser);
export const updateUserAction = (userId, formValues, callback) => async (dispatch, getState) => {
  const state = getState();
  const { auth } = state;
  try {
    const token = auth.authenticated;
    const response = await axios.patch(`${OMAPFOLDER_SERVER}/users/${userId}`, formValues, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: USER_UPDATED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(USER_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// delete the specified user (multiple deletion not supported)
// app.delete('/users/:id', requireAuth, Users.deleteUser);
export const deleteUserAction = (userId, callback) => async (dispatch, getState) => {
  const state = getState();
  const { auth } = state;
  try {
    const token = auth.authenticated;
    const response = await axios.delete(`${OMAPFOLDER_SERVER}/users/${userId}`, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: USER_DELETED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(USER_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// delete profile image of the specified user
// app.delete('/users/:id/profileImage', requireAuth, Users.deleteProfileImage)
export const deleteProfileImageAction = (userId, callback) => async (dispatch, getState) => {
  const state = getState();
  const { auth } = state;
  try {
    const token = auth.authenticated;
    await axios.delete(`${OMAPFOLDER_SERVER}/users/${userId}/profileImage`, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: USER_DELETED_IMAGE, payload: userId });
    if (callback) callback(true);
  } catch (err) {
    handleError(USER_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};
