import axios from 'axios';
import {
  AUTH_USER,
  AUTH_ERROR,
  CLUB_GOT_BY_ID,
  CLUB_GOT_LIST,
  CLUB_GOT_MEMBERS,
  CLUB_GOT_EVENTS,
  CLUB_CREATED,
  CLUB_UPDATED,
  CLUB_DELETED,
  CLUB_ERROR,
  CLUB_CHANGE_SEARCH_FIELD,
  CLUB_CHANGE_VIEW_MODE,
  CLUB_SELECT_CLUB,
  CLUB_SELECT_CLUB_MEMBER,
  CLUB_SELECT_CLUB_EVENT,
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
// change club view mode
export const setClubViewModeAction = (mode) => {
  const validModes = ['none', 'view', 'add', 'edit', 'delete'];
  if (validModes.includes(mode)) {
    return ({
      type: CLUB_CHANGE_VIEW_MODE,
      payload: mode,
    });
  }
  console.log('Warning: Invalid view mode! There\'s a typo somewhere', mode);
  return null;
};
// track changes to the club search field
export const setClubSearchFieldAction = text => ({
  type: CLUB_CHANGE_SEARCH_FIELD,
  payload: text,
});
// select a club to show further information
export const selectClubToDisplayAction = clubId => ({
  type: CLUB_SELECT_CLUB,
  payload: clubId,
});
// select a club member to show further information (user profile + maps)
export const selectClubMemberAction = userId => ({
  type: CLUB_SELECT_CLUB_MEMBER,
  payload: userId,
});
// select a club's event to show further information (event details + maps)
export const selectClubEventAction = eventId => ({
  type: CLUB_SELECT_CLUB_EVENT,
  payload: eventId,
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
    const response = await axios.post(`${OMAPFOLDER_SERVER}/login`, formValues);
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
    if (callback) callback(true);
  } catch (err) {
    handleError(USER_ERROR)(err, dispatch);
    if (callback) callback(false);
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
    if (callback) callback(true);
  } catch (err) {
    handleError(USER_ERROR)(err, dispatch);
    if (callback) callback(false);
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
    if (callback) callback(true);
  } catch (err) {
    handleError(USER_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// update the specified user (multiple amendment not supported)
// app.patch('/users/:id', requireAuth, Users.updateUser);

// delete the specified user (multiple deletion not supported)
// app.delete('/users/:id', requireAuth, Users.deleteUser);

// delete profile image of the specified user
// app.delete('/users/:id/profileImage', requireAuth, Users.deleteProfileImage)

// retrieve a list of all clubs (ids) matching specified criteria
// app.get('/clubs', publicRoute, Clubs.getClubList);
export const getClubListAction = (searchCriteria, callback) => async (dispatch) => {
  const queryString = (searchCriteria) ? toQueryString(searchCriteria) : '';
  // console.log('getClubListAction called.');
  // console.log('callback in getClubList', callback);
  try {
    const response = await axios.get(`${OMAPFOLDER_SERVER}/clubs${queryString}`);
    dispatch({ type: CLUB_GOT_LIST, payload: [...response.data, queryString] });
    if (callback) callback(true);
  } catch (err) {
    handleError(CLUB_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// create a club
// autopopulate Czech clubs from abbreviation
// app.post('/clubs', requireAuth, Clubs.createClub);
export const createClubAction = (formValues, callback) => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.post(`${OMAPFOLDER_SERVER}/clubs`, formValues, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: CLUB_CREATED, payload: response.data });
    // console.log('callback', callback);
    if (callback) callback(true);
  } catch (err) {
    handleError(CLUB_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// retrieve full details for the specified club
// *** NOT CURRENTLY NEEDED AS LIST CONTAINS FULL DETAILS FOR EACH CLUB IN IT ***
// app.get('/clubs/:id', publicRoute, Clubs.getClubById);
export const getClubByIdAction = (userId, callback) => async (dispatch) => {
  // console.log('getClubByIdAction called.');
  try {
    const response = await axios.get(`${OMAPFOLDER_SERVER}/clubs/${userId}`);
    // console.log('response:', response.data);
    dispatch({ type: CLUB_GOT_BY_ID, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(CLUB_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// get a list of users that are members of the specified club
export const getClubMembersAction = (clubId, callback) => async (dispatch) => {
  if (!clubId) {
    dispatch({ type: CLUB_ERROR, payload: 'No club specified.' });
  } else {
    const queryString = toQueryString({ memberOf: clubId });
    // console.log('getClubMembersAction called.');
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
      dispatch({
        type: CLUB_GOT_MEMBERS,
        payload: {
          clubId,
          memberList: response.data,
        },
      });
      if (callback) callback(true);
    } catch (err) {
      handleError(CLUB_ERROR)(err, dispatch);
      if (callback) callback(false);
    }
  }
};

// get a list of events organised by the specified club
export const getClubEventsAction = (clubId, callback) => async (dispatch) => {
  if (!clubId) {
    dispatch({ type: CLUB_ERROR, payload: 'No club specified.' });
  } else {
    const queryString = toQueryString({ organisedBy: clubId });
    // console.log('getClubEventsAction called.');
    try {
      const token = localStorage.getItem('omapfolder-auth-token');
      // console.log('token:', token);
      let response;
      if (token) {
        response = await axios.get(`${OMAPFOLDER_SERVER}/events${queryString}`, {
          headers: { Authorization: `bearer ${token}` },
        });
      } else {
        response = await axios.get(`${OMAPFOLDER_SERVER}/events/public${queryString}`);
      }
      dispatch({
        type: CLUB_GOT_EVENTS,
        payload: {
          clubId,
          eventList: response.data,
        },
      });
      if (callback) callback(true);
    } catch (err) {
      handleError(CLUB_ERROR)(err, dispatch);
      if (callback) callback(false);
    }
  }
};

// update the specified club (multiple amendment not supported)
// try to populate ORIS if abbreviation changes and looks Czech
// app.patch('/clubs/:id', requireAuth, Clubs.updateClub);
export const updateClubAction = (clubId, formValues, callback) => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.patch(`${OMAPFOLDER_SERVER}/clubs/${clubId}`, formValues, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: CLUB_UPDATED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(CLUB_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// delete the specified club (multiple deletion not supported)
// app.delete('/clubs/:id', requireAuth, Clubs.deleteClub);
export const deleteClubAction = (clubId, callback) => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.delete(`${OMAPFOLDER_SERVER}/clubs/${clubId}`, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: CLUB_DELETED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(CLUB_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};


// *** /events routes ***  [OEvent and LinkedEvent models]
// query string ids need to be more explicit as there are several types used
// create an event (event level fields)
// app.post('/events', requireAuth, Events.createEvent);

// create a new event linkage between the specified events (must be at least one event)
// app.post('/events/links', requireAuth, Events.createEventLink);

// add user as a runner at the specified event (event.runners[] fields except maps)
// app.post('/events/:eventid/maps', requireAuth, Events.addEventRunner);

// upload a scanned map to the specified event map document (maptitle for differentiation)
// :mapid is the index in runners.maps, :maptype is either course or route
// :maptitle is the label to use for each part of multi-part maps
// app.post('/events/:eventid/maps/:mapid/:maptype(course|route)/:maptitle', requireAuth,
//   Events.validateMapUploadPermission, images.uploadMap.single('upload'),
//   Events.postMap, images.errorHandler);
// NOT IMPLEMENTED YET!

// Post a new comment against the specified user's map in this event
// app.post('/events/:eventid/comments/:userid', requireAuth, Events.postComment);
// NOT IMPLEMENTED YET!

// create a new event using oris data *eventid is ORIS event id*
// if a corresponding event is already in db, fill empty fields only
// create runner fields for logged in user if found in ORIS (i.e. can use to add user to event)
// app.post('/events/oris/:oriseventid', requireAuth, Events.orisCreateEvent);
// *** DONE EXCEPT HANDLING MULTI-DAY EVENTS ***

// retrieve a list of all events (ids) matching specified criteria
// [may include events without *maps* visible to current user, include number
// of (visible) maps in returned list]
// app.get('/events', requireAuth, Events.getEventList);

// retrieve a list of events as an anonymous browser
// app.get('/events/public', publicRoute, Events.getEventList);

// retrieve a list of links between events matching specified criteria
// no need for a get with ID, full contents provided (name and linked events)
// app.get('/events/links', publicRoute, Events.getEventLinks);

// retrieve a list of all events on ORIS that the current user has entered
// assumption is that front end will use this to provide a list to select from
// before calling POST /events/oris/:oriseventid
// app.get('/events/oris', requireAuth, Events.orisGetUserEvents);

// retrieve full details for the specified event
// [including visible maps and basic info for linked events]
// app.get('/events/:eventid', requireAuth, Events.getEvent);

// retrieve all visible details for the specified event as an anonymous browser
// app.get('/events/:eventid/public', publicRoute, Events.getEvent);

// update the specified event (multiple amendment not supported)
// app.patch('/events/:eventid', requireAuth, Events.updateEvent);

// update the specified runner and map data (multiple amendment not supported)
// app.patch('/events/:eventid/maps/:userid', requireAuth, Events.updateEventRunner);

// update the specified link between events (multiple amendment not supported)
// app.patch('/events/links/:eventlinkid', requireAuth, Events.updateEventLink);

// edit the specified comment (multiple amendment not supported)
// app.patch('/events/:eventid/comments/:userid/:commentid', requireAuth, Events.updateComment);
// NOT IMPLEMENTED YET!

// delete the specified event (multiple delete not supported)
// [will fail if other users have records attached to event, unless admin]
// app.delete('/events/:eventid', requireAuth, Events.deleteEvent);

// delete the specified runner and map data (multiple amendment not supported)
// app.delete('/events/:eventid/maps/:userid', requireAuth, Events.deleteEventRunner);
// NOT IMPLEMENTED YET!

// delete the specified link between events (multiple amendment not supported)
// NOTE: not expected to be used except for administrative tidying - the normal
// removal approach will be through editing the event to remove it from the linked set
// *hence this route will be constrained to admin users only*
// app.delete('/events/links/:eventlinkid', requireAuth, Events.deleteEventLink);

// delete the specified comment (multiple amendment not supported)
// app.delete('/events/:eventid/comments/:userid/:commentid', requireAuth, Events.deleteComment);
// NOT IMPLEMENTED YET!
