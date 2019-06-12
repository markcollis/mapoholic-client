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
  EVENT_RUNNER_DELETED,
  EVENT_MAP_DELETED,
  EVENT_LINK_DELETED,
  EVENT_COMMENT_DELETED,
  EVENT_ERROR,
  EVENT_CHANGE_SEARCH_FIELD_EVENTS,
  EVENT_CHANGE_SEARCH_FIELD_MYMAPS,
  EVENT_CHANGE_VIEW_EVENT_EVENTS,
  EVENT_CHANGE_VIEW_EVENT_MYMAPS,
  EVENT_CHANGE_VIEW_EVENT_MAPVIEW,
  EVENT_CHANGE_VIEW_EVENT_LINK,
  EVENT_CHANGE_VIEW_RUNNER,
  EVENT_SELECT_EVENT_DETAILS_EVENTS,
  EVENT_SELECT_EVENT_DETAILS_MYMAPS,
  EVENT_SELECT_EVENT_DETAILS_MAPVIEW,
  EVENT_SELECT_EVENT_DISPLAY,
  EVENT_SELECT_RUNNER,
  EVENT_SELECT_MAP,
  EVENT_MAP_SET_BOUNDS_EVENTS,
  EVENT_MAP_SET_BOUNDS_MYMAPS,
  EVENT_MAP_SET_ZOOM_EVENTS,
  EVENT_MAP_SET_ZOOM_MYMAPS,
} from './types';
import { OMAPFOLDER_SERVER } from '../config';
/* eslint no-underscore-dangle: ["error", { "allow": ["_boundary"]}] */

// *** Local Actions ***
// change event view mode (events - Events view)
export const setEventViewModeEventEventsAction = (mode) => {
  const validModes = ['none', 'view', 'add', 'edit', 'delete'];
  if (validModes.includes(mode)) {
    return ({
      type: EVENT_CHANGE_VIEW_EVENT_EVENTS,
      payload: mode,
    });
  }
  return null;
};
// change event view mode (events - MyMaps view)
export const setEventViewModeEventMyMapsAction = (mode) => {
  const validModes = ['none', 'view', 'add', 'edit', 'delete'];
  if (validModes.includes(mode)) {
    return ({
      type: EVENT_CHANGE_VIEW_EVENT_MYMAPS,
      payload: mode,
    });
  }
  return null;
};
// change event view mode (events - Map view)
export const setEventViewModeEventMapViewAction = (mode) => {
  const validModes = ['none', 'view', 'add', 'edit', 'delete'];
  if (validModes.includes(mode)) {
    return ({
      type: EVENT_CHANGE_VIEW_EVENT_MAPVIEW,
      payload: mode,
    });
  }
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
  return null;
};
// track changes to the event search field (Events view)
export const setEventSearchFieldEventsAction = text => ({
  type: EVENT_CHANGE_SEARCH_FIELD_EVENTS,
  payload: text,
});
// track changes to the event search field (MyMaps view)
export const setEventSearchFieldMyMapsAction = text => ({
  type: EVENT_CHANGE_SEARCH_FIELD_MYMAPS,
  payload: text,
});
// select an event to show additional details (Events view)
export const selectEventForDetailsEventsAction = eventId => ({
  type: EVENT_SELECT_EVENT_DETAILS_EVENTS,
  payload: eventId,
});
// select an event to show additional details (MyMaps view)
export const selectEventForDetailsMyMapsAction = eventId => ({
  type: EVENT_SELECT_EVENT_DETAILS_MYMAPS,
  payload: eventId,
});
// select an event to show additional details (Map view)
export const selectEventForDetailsMapViewAction = eventId => ({
  type: EVENT_SELECT_EVENT_DETAILS_MAPVIEW,
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
// set lat/long bounds for overview map (Events view)
export const setMapBoundsEventsAction = bounds => ({
  type: EVENT_MAP_SET_BOUNDS_EVENTS,
  payload: bounds,
});
// set lat/long bounds for overview map (MyMaps view)
export const setMapBoundsMyMapsAction = bounds => ({
  type: EVENT_MAP_SET_BOUNDS_MYMAPS,
  payload: bounds,
});
// set zoom level for overview map (Events view)
export const setMapZoomEventsAction = zoomLevel => ({
  type: EVENT_MAP_SET_ZOOM_EVENTS,
  payload: zoomLevel,
});
// set zoom level for overview map (MyMaps view)
export const setMapZoomMyMapsAction = zoomLevel => ({
  type: EVENT_MAP_SET_ZOOM_MYMAPS,
  payload: zoomLevel,
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

// *** API actions ***
// *** /events routes ***  [OEvent and LinkedEvent models]
// query string ids need to be more explicit as there are several types used
// create an event (event level fields)
// app.post('/events', requireAuth, Events.createEvent);
export const createEventAction = (formValues, callback) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
    const response = await axios.post(`${OMAPFOLDER_SERVER}/events`, formValues, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_CREATED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// create a new event linkage between the specified events (must be at least one event)
// app.post('/events/links', requireAuth, Events.createEventLink);
export const createEventLinkAction = (formValues, callback) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
    const response = await axios.post(`${OMAPFOLDER_SERVER}/events/links`, formValues, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_LINK_CREATED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// add current user as a runner at the specified event
// app.post('/events/:eventid/maps', requireAuth, Events.addEventRunner);
export const addEventRunnerAction = (eventId, callback) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
    const response = await axios.post(`${OMAPFOLDER_SERVER}/events/${eventId}/maps`, null, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_RUNNER_ADDED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};
// app.post('/events/:eventid/oris', requireAuth, Events.orisAddEventRunner);
// *** autopopulate fields from ORIS for current user then call addEventRunner ***
export const addEventRunnerOrisAction = (eventId, callback) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
    const response = await axios.post(`${OMAPFOLDER_SERVER}/events/${eventId}/oris`, null, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_RUNNER_ADDED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// retrieve a list of all events (ids) matching specified criteria
// [may include events without *maps* visible to current user, include number
// of (visible) maps in returned list]
// app.get('/events', requireAuth, Events.getEventList);
// retrieve a list of events as an anonymous browser
// app.get('/events/public', publicRoute, Events.getEventList);
export const getEventListAction = (searchCriteria, callback) => async (dispatch, getState) => {
  // console.log('getEventListAction triggered');
  const queryString = (searchCriteria) ? toQueryString(searchCriteria) : '';
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
    let response;
    if (token) {
      response = await axios.get(`${OMAPFOLDER_SERVER}/events${queryString}`, {
        headers: { Authorization: `bearer ${token}` },
      });
    } else {
      response = await axios.get(`${OMAPFOLDER_SERVER}/events/public${queryString}`);
    }
    dispatch({ type: EVENT_GOT_LIST, payload: response.data });
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
export const postMapAction = (parameters, file, callback) => async (dispatch, getState) => {
  const {
    eventId,
    userId,
    mapType,
    mapTitle,
  } = parameters;
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
    const validMapType = (mapType === 'course') || (mapType === 'route');
    if (!eventId || !userId || !validMapType) throw new Error('invalid parameters');
    const formData = new FormData();
    formData.append('upload', file, file.name);
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
    dispatch({
      type: EVENT_MAP_UPLOADED,
      payload: {
        parameters,
        updatedEvent: response.data,
      },
    });
    // dispatch(getEventListAction()); // refresh background map for EventListItem
    if (callback) callback(true);
  } catch (err) {
    handleError(EVENT_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// Post a new comment against the specified user's map in this event
// app.post('/events/:eventid/comments/:userid', requireAuth, Events.postComment);
export const postCommentAction = (eventId, userId, formValues, callback) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const { auth } = state;
      const token = auth.authenticated;
      const response = await axios.post(
        `${OMAPFOLDER_SERVER}/events/${eventId}/comments/${userId}`,
        formValues,
        { headers: { Authorization: `bearer ${token}` } },
      );
      dispatch({
        type: EVENT_COMMENT_ADDED,
        payload: { eventId, userId, comments: response.data },
      });
      if (callback) callback(true);
    } catch (err) {
      handleError(EVENT_ERROR)(err, dispatch);
      if (callback) callback(false);
    }
  };
};

// create a new event using oris data *eventid is ORIS event id*
// if a corresponding event is already in db, fill empty fields only
// create runner fields for logged in user if found in ORIS (i.e. can use to add user to event)
// app.post('/events/oris/:oriseventid', requireAuth, Events.orisCreateEvent);
// *** DONE EXCEPT HANDLING MULTI-DAY EVENTS ***
export const createEventOrisAction = (orisEventId, callback) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
    const response = await axios.post(`${OMAPFOLDER_SERVER}/events/oris/${orisEventId}`, null, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_CREATED, payload: response.data });
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
    dispatch({ type: EVENT_GOT_EVENT_LINK_LIST, payload: response.data });
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
export const getEventListOrisAction = callback => async (dispatch, getState) => {
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
    const response = await axios.get(`${OMAPFOLDER_SERVER}/events/oris`, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: EVENT_GOT_ORIS_LIST, payload: response.data });
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
export const getEventByIdAction = (eventId, callback) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
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
export const updateEventAction = (eventId, formValues, callback) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
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
) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
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
export const updateEventLinkAction = (eventLinkId, formValues, callback) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const { auth } = state;
      const token = auth.authenticated;
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
};

// edit the specified comment (multiple amendment not supported)
// app.patch('/events/:eventid/comments/:userid/:commentid', requireAuth, Events.updateComment);
export const updateCommentAction = (eventId, userId, commentId, formValues, callback) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const { auth } = state;
      const token = auth.authenticated;
      const response = await axios.patch(
        `${OMAPFOLDER_SERVER}/events/${eventId}/comments/${userId}/${commentId}`,
        formValues,
        { headers: { Authorization: `bearer ${token}` } },
      );
      dispatch({
        type: EVENT_COMMENT_UPDATED,
        payload: { eventId, userId, comments: response.data },
      });
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
export const deleteEventAction = (eventId, callback) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
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
export const deleteEventRunnerAction = (eventId, userId, callback) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const { auth } = state;
      const token = auth.authenticated;
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
};

// delete the specified map (multiple deletion not supported)
// app.delete('/events/:eventid/maps/:userid/:maptype(course|route)/:maptitle?',
// requireAuth, Events.deleteMap);
export const deleteMapAction = (parameters, callback) => async (dispatch, getState) => {
  const {
    eventId,
    userId,
    mapType,
    mapTitle,
  } = parameters;
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
    const validMapType = (mapType === 'course') || (mapType === 'route');
    if (!eventId || !userId || !validMapType) throw new Error('invalid parameters');
    const response = await axios.delete(
      `${OMAPFOLDER_SERVER}/events/${eventId}/maps/${userId}/${mapType}${(mapTitle) ? `/${mapTitle}` : ''}`,
      {
        headers: { Authorization: `bearer ${token}` },
      },
    );
    dispatch({
      type: EVENT_MAP_DELETED,
      payload: {
        parameters,
        updatedEvent: response.data,
      },
    });
    // dispatch(getEventListAction()); // refresh background map for EventListItem
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
export const deleteEventLinkAction = (eventLinkId, callback) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
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
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const { auth } = state;
      const token = auth.authenticated;
      const response = await axios.delete(
        `${OMAPFOLDER_SERVER}/events/${eventId}/comments/${userId}/${commentId}`,
        { headers: { Authorization: `bearer ${token}` } },
      );
      dispatch({
        type: EVENT_COMMENT_DELETED,
        payload: { eventId, userId, comments: response.data },
      });
      if (callback) callback(true);
    } catch (err) {
      handleError(EVENT_ERROR)(err, dispatch);
      if (callback) callback(false);
    }
  };
};
