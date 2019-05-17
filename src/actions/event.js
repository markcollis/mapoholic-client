
import axios from 'axios';
import {
  EVENT_GOT_LIST,
  EVENT_GOT_EVENT_LINK_LIST,
  EVENT_GOT_ORIS_LIST,
  EVENT_GOT_BY_ID,
  EVENT_CREATED, // same action whether or not ORIS ref is used
  EVENT_LINK_CREATED,
  EVENT_RUNNER_ADDED,
  EVENT_MAP_UPLOADED,
  EVENT_COMMENT_ADDED,
  EVENT_UPDATED,
  EVENT_RUNNER_UPDATED,
  EVENT_LINK_UPDATED,
  EVENT_COMMENT_UPDATED,
  EVENT_DELETED,
  EVENT_RUNNER_DELETED, // not yet implemented on back end
  EVENT_MAP_DELETED,
  EVENT_LINK_DELETED,
  EVENT_COMMENT_DELETED,
  EVENT_ERROR,
  EVENT_CHANGE_SEARCH_FIELD,
  EVENT_CHANGE_VIEW_EVENT,
  EVENT_CHANGE_VIEW_EVENT_LINK,
  EVENT_CHANGE_VIEW_RUNNER,
  EVENT_CHANGE_VIEW_COMMENT,
  EVENT_SELECT_EVENT_DETAILS,
  EVENT_SELECT_EVENT_DISPLAY,
  EVENT_SELECT_RUNNER,
  EVENT_SELECT_MAP,
} from './types';
import { OMAPFOLDER_SERVER } from '../config';
/* eslint no-underscore-dangle: ["error", { "allow": ["_boundary"]}] */

// Local Actions
// change event view mode (events)
export const setEventViewModeEventAction = (mode) => {
  const validModes = ['none', 'view', 'add', 'edit', 'delete'];
  if (validModes.includes(mode)) {
    return ({
      type: EVENT_CHANGE_VIEW_EVENT,
      payload: mode,
    });
  }
  // console.log('Warning: Invalid event/event view mode! There\'s a typo somewhere', mode);
  return null;
};
// change event view mode (event link)
export const setEventViewModeEventLinkAction = (mode, target = '') => {
  const validModes = ['none', 'view', 'add', 'edit', 'delete'];
  if (validModes.includes(mode)) {
    return ({
      type: EVENT_CHANGE_VIEW_EVENT_LINK,
      payload: { mode, target },
    });
  }
  // console.log('Warning: Invalid event link view mode! There\'s a typo somewhere', mode);
  return null;
};
// change event view mode (runner)
export const setEventViewModeRunnerAction = (mode) => {
  const validModes = ['none', 'view', 'add', 'edit', 'delete'];
  if (validModes.includes(mode)) {
    return ({
      type: EVENT_CHANGE_VIEW_RUNNER,
      payload: mode,
    });
  }
  // console.log('Warning: Invalid event/runner view mode! There\'s a typo somewhere', mode);
  return null;
};
// change event view mode (comment)
export const setEventViewModeCommentAction = (mode) => {
  const validModes = ['view', 'edit', 'delete'];
  if (validModes.includes(mode)) {
    return ({
      type: EVENT_CHANGE_VIEW_COMMENT,
      payload: mode,
    });
  }
  // console.log('Warning: Invalid event/comment view mode! There\'s a typo somewhere', mode);
  return null;
};
// track changes to the event search field
export const setEventSearchFieldAction = text => ({
  type: EVENT_CHANGE_SEARCH_FIELD,
  payload: text,
});
// select an event to show additional details in list/map view
export const selectEventForDetailsAction = eventId => ({
  type: EVENT_SELECT_EVENT_DETAILS,
  payload: eventId,
});
// select an event to display maps for
export const selectEventToDisplayAction = eventId => ({
  type: EVENT_SELECT_EVENT_DISPLAY,
  payload: eventId,
});
// select a runner at an event to display maps for
export const selectRunnerToDisplayAction = userId => ({
  type: EVENT_SELECT_RUNNER,
  payload: userId,
});
// select a runner's map to show it
export const selectMapToDisplayAction = mapId => ({
  type: EVENT_SELECT_MAP,
  payload: mapId,
});
// cancel a displayed error message
export const cancelEventErrorAction = () => ({
  type: EVENT_ERROR,
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

// *** /events routes ***  [OEvent and LinkedEvent models]
// query string ids need to be more explicit as there are several types used
// create an event (event level fields)
// app.post('/events', requireAuth, Events.createEvent);
export const createEventAction = (formValues, callback) => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.post(`${OMAPFOLDER_SERVER}/events`, formValues, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_CREATED, payload: response.data });
    // console.log('callback', callback);
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// create a new event linkage between the specified events (must be at least one event)
// app.post('/events/links', requireAuth, Events.createEventLink);
export const createEventLinkAction = (formValues, callback) => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.post(`${OMAPFOLDER_SERVER}/events/links`, formValues, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_LINK_CREATED, payload: response.data });
    // console.log('callback', callback);
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// add current user as a runner at the specified event
// app.post('/events/:eventid/maps', requireAuth, Events.addEventRunner);
export const addEventRunnerAction = (eventId, callback) => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.post(`${OMAPFOLDER_SERVER}/events/${eventId}/maps`, null, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_RUNNER_ADDED, payload: response.data });
    // console.log('callback', callback);
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};
// app.post('/events/:eventid/oris', requireAuth, Events.orisAddEventRunner);
// *** autopopulate fields from ORIS for current user then call addEventRunner ***
export const addEventRunnerOrisAction = (eventId, callback) => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.post(`${OMAPFOLDER_SERVER}/events/${eventId}/oris`, null, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_RUNNER_ADDED, payload: response.data });
    // console.log('callback', callback);
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// upload a scanned map to the specified event for user :userid
// :maptype is either course or route
// :maptitle is the label to use for each part of multi-part maps (optional, default '')
// app.post('/events/:eventid/maps/:userid/:maptype(course|route)/:maptitle?', requireAuth,
//   Events.validateMapUploadPermission, images.uploadMap.single('upload'),
//   Events.postMap, images.errorHandler);
export const postMapAction = (parameters, file, callback) => async (dispatch) => {
  // console.log('postMapAction called.');
  // console.log('file submitted:', file);
  const {
    eventId,
    userId,
    mapType,
    mapTitle,
  } = parameters;
  try {
    const validMapType = (mapType === 'course') || (mapType === 'route');
    if (!eventId || !userId || !validMapType) throw new Error('invalid parameters');
    // const now = new Date();
    // console.log('now', now.getTime());
    const formData = new FormData();
    formData.append('upload', file, file.name);
    // console.log('formData:', formData);
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.post(
      `${OMAPFOLDER_SERVER}/events/${eventId}/maps/${userId}/${mapType}${(mapTitle) ? `/${mapTitle}` : ''}`,
      formData,
      {
        headers: {
          Authorization: `bearer ${token}`,
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        },
      },
    );
    // console.log('response:', response.data);
    dispatch({
      type: EVENT_MAP_UPLOADED,
      payload: {
        parameters,
        updatedEvent: response.data,
      },
    });
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// Post a new comment against the specified user's map in this event
// app.post('/events/:eventid/comments/:userid', requireAuth, Events.postComment);
export const postCommentAction = (eventId, userId, formValues, callback) => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.post(
      `${OMAPFOLDER_SERVER}/events/${eventId}/comments/${userId}`,
      formValues,
      { headers: { Authorization: `bearer ${token}` } },
    );
    dispatch({
      type: EVENT_COMMENT_ADDED,
      payload: { eventId, userId, comments: response.data },
    });
    // console.log('callback', callback);
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// create a new event using oris data *eventid is ORIS event id*
// if a corresponding event is already in db, fill empty fields only
// create runner fields for logged in user if found in ORIS (i.e. can use to add user to event)
// app.post('/events/oris/:oriseventid', requireAuth, Events.orisCreateEvent);
// *** DONE EXCEPT HANDLING MULTI-DAY EVENTS ***
export const createEventOrisAction = (orisEventId, callback) => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.post(`${OMAPFOLDER_SERVER}/events/oris/${orisEventId}`, null, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_CREATED, payload: response.data });
    // console.log('callback', callback);
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// create a set of new events and auto-populate them based on the user's ORIS history
// app.post('/events/oris/user/:userid', requireAuth, Events.orisCreateUserEvents);
// NOT DONE - CONSIDER WHETHER THIS IS REALLY A GOOD IDEA...

// retrieve a list of all events (ids) matching specified criteria
// [may include events without *maps* visible to current user, include number
// of (visible) maps in returned list]
// app.get('/events', requireAuth, Events.getEventList);
// retrieve a list of events as an anonymous browser
// app.get('/events/public', publicRoute, Events.getEventList);
export const getEventListAction = (searchCriteria, callback) => async (dispatch) => {
  const queryString = (searchCriteria) ? toQueryString(searchCriteria) : '';
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    let response;
    if (token) {
      response = await axios.get(`${OMAPFOLDER_SERVER}/events${queryString}`, {
        headers: { Authorization: `bearer ${token}` },
      });
    } else {
      response = await axios.get(`${OMAPFOLDER_SERVER}/events/public${queryString}`);
    }
    dispatch({ type: EVENT_GOT_LIST, payload: [...response.data, queryString] });
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// retrieve a list of links between events matching specified criteria
// no need for a get with ID, full contents provided (name and linked events)
// app.get('/events/links', publicRoute, Events.getEventLinks);
export const getEventLinkListAction = (searchCriteria, callback) => async (dispatch) => {
  const queryString = (searchCriteria) ? toQueryString(searchCriteria) : '';
  try {
    const response = await axios.get(`${OMAPFOLDER_SERVER}/events/links${queryString}`);
    dispatch({ type: EVENT_GOT_EVENT_LINK_LIST, payload: [...response.data, queryString] });
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// retrieve a list of all events on ORIS that the current user has entered
// assumption is that front end will use this to provide a list to select from
// before calling POST /events/oris/:oriseventid
// app.get('/events/oris', requireAuth, Events.orisGetUserEvents);
export const getEventListOrisAction = callback => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.get(`${OMAPFOLDER_SERVER}/events/oris`, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_GOT_ORIS_LIST, payload: response.data });
    // console.log('callback', callback);
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// retrieve full details for the specified event
// [including visible maps and basic info for linked events]
// app.get('/events/:eventid', requireAuth, Events.getEvent);
// retrieve all visible details for the specified event as an anonymous browser
// app.get('/events/:eventid/public', publicRoute, Events.getEvent);
export const getEventByIdAction = (eventId, callback) => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    let response;
    if (token) {
      response = await axios.get(`${OMAPFOLDER_SERVER}/events/${eventId}`, {
        headers: { Authorization: `bearer ${token}` },
      });
    } else {
      response = await axios.get(`${OMAPFOLDER_SERVER}/events/${eventId}/public`);
    }
    dispatch({ type: EVENT_GOT_BY_ID, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// update the specified event (multiple amendment not supported)
// app.patch('/events/:eventid', requireAuth, Events.updateEvent);
export const updateEventAction = (eventId, formValues, callback) => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.patch(`${OMAPFOLDER_SERVER}/events/${eventId}`, formValues, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_UPDATED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// update the specified runner and map data (multiple amendment not supported)
// app.patch('/events/:eventid/maps/:userid', requireAuth, Events.updateEventRunner);
export const updateEventRunnerAction = (
  eventId,
  userId,
  formValues,
  callback,
) => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.patch(`${OMAPFOLDER_SERVER}/events/${eventId}/maps/${userId}`, formValues, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_RUNNER_UPDATED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// update the specified link between events (multiple amendment not supported)
// app.patch('/events/links/:eventlinkid', requireAuth, Events.updateEventLink);
export const updateEventLinkAction = (eventLinkId, formValues, callback) => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.patch(`${OMAPFOLDER_SERVER}/events/links/${eventLinkId}`, formValues, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_LINK_UPDATED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// edit the specified comment (multiple amendment not supported)
// app.patch('/events/:eventid/comments/:userid/:commentid', requireAuth, Events.updateComment);
export const updateCommentAction = (eventId, userId, commentId, formValues, callback) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('omapfolder-auth-token');
      const response = await axios.patch(
        `${OMAPFOLDER_SERVER}/events/${eventId}/comments/${userId}/${commentId}`,
        formValues,
        { headers: { Authorization: `bearer ${token}` } },
      );
      dispatch({
        type: EVENT_COMMENT_UPDATED,
        payload: { eventId, userId, comments: response.data },
      });
      // dispatch({ type: EVENT_COMMENT_UPDATED, payload: response.data });
      // console.log('callback', callback);
      if (callback) callback(true);
    } catch (err) {
      handleError(EVENT_ERROR)(err, dispatch);
      if (callback) callback(false);
    }
  };
};

// delete the specified event (multiple delete not supported)
// [will fail if other users have records attached to event, unless admin]
// app.delete('/events/:eventid', requireAuth, Events.deleteEvent);
export const deleteEventAction = (eventId, callback) => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.delete(`${OMAPFOLDER_SERVER}/events/${eventId}`, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_DELETED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// delete the specified runner and map data (multiple deletion not supported)
// app.delete('/events/:eventid/maps/:userid', requireAuth, Events.deleteEventRunner);
// NOT DONE YET - placeholder on front end
export const deleteEventRunnerAction = (eventId, userId, callback) => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.delete(`${OMAPFOLDER_SERVER}/events/${eventId}/maps/${userId}`, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_RUNNER_DELETED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// delete the specified map (multiple deletion not supported)
// app.delete('/events/:eventid/maps/:userid/:maptype(course|route)/:maptitle?',
// requireAuth, Events.deleteMap);
export const deleteMapAction = (parameters, callback) => async (dispatch) => {
  // console.log('deleteMapAction called.');
  const {
    eventId,
    userId,
    mapType,
    mapTitle,
  } = parameters;
  try {
    const validMapType = (mapType === 'course') || (mapType === 'route');
    if (!eventId || !userId || !validMapType) throw new Error('invalid parameters');
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.delete(
      `${OMAPFOLDER_SERVER}/events/${eventId}/maps/${userId}/${mapType}${(mapTitle) ? `/${mapTitle}` : ''}`,
      {
        headers: { Authorization: `bearer ${token}` },
      },
    );
    // console.log('response:', response.data);
    dispatch({
      type: EVENT_MAP_DELETED,
      payload: {
        parameters,
        updatedEvent: response.data,
      },
    });
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// delete the specified link between events (multiple deletion not supported)
// NOTE: not expected to be used except for administrative tidying - the normal
// removal approach will be through editing the event to remove it from the linked set
// *hence this route will be constrained to admin users only*
// app.delete('/events/links/:eventlinkid', requireAuth, Events.deleteEventLink);
export const deleteEventLinkAction = (eventLinkId, callback) => async (dispatch) => {
  try {
    const token = localStorage.getItem('omapfolder-auth-token');
    const response = await axios.delete(`${OMAPFOLDER_SERVER}/events/links/${eventLinkId}`, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_LINK_DELETED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// delete the specified comment (multiple deletion not supported)
// app.delete('/events/:eventid/comments/:userid/:commentid', requireAuth, Events.deleteComment);
export const deleteCommentAction = (eventId, userId, commentId, callback) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('omapfolder-auth-token');
      const response = await axios.delete(
        `${OMAPFOLDER_SERVER}/events/${eventId}/comments/${userId}/${commentId}`,
        { headers: { Authorization: `bearer ${token}` } },
      );
      // dispatch({ type: EVENT_COMMENT_DELETED, payload: response.data });
      dispatch({
        type: EVENT_COMMENT_DELETED,
        payload: { eventId, userId, comments: response.data },
      });
      // console.log('callback', callback);
      if (callback) callback(true);
    } catch (err) {
      handleError(EVENT_ERROR)(err, dispatch);
      if (callback) callback(false);
    }
  };
};
