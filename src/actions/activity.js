import axios from 'axios';
import {
  ACTIVITY_GOT_ADMIN,
  ACTIVITY_GOT_ALL,
  ACTIVITY_GOT_OWN,
  ACTIVITY_ERROR,
} from './types';
import { MAPOHOLIC_SERVER } from '../config';

// cancel a displayed error message
export const cancelActivityErrorAction = () => ({
  type: ACTIVITY_ERROR,
  payload: '',
});

// *** actions that are functions are enabled by redux-thunk middleware ***

// *** Helper functions ***
// handle errors consistently, for all routes except login
const handleError = (errorType) => (err, dispatch) => {
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

// *** API functions ***
export const getActivityLogAdminAction = (searchCriteria, callback) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const { auth } = state;
      const token = auth.authenticated;
      const queryString = (searchCriteria) ? toQueryString(searchCriteria) : '';
      const response = await axios.get(`${MAPOHOLIC_SERVER}/activity${queryString}`, {
        headers: { Authorization: `bearer ${token}` },
      });
      dispatch({ type: ACTIVITY_GOT_ADMIN, payload: response.data });
      if (callback) callback(true);
    } catch (err) {
      handleError(ACTIVITY_ERROR)(err, dispatch);
      if (callback) callback(false);
    }
  };
};

export const getActivityLogAllAction = (number, callback) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const { auth } = state;
      const token = auth.authenticated;
      const queryString = (number) ? `?number=${number}` : '';
      const response = await axios.get(`${MAPOHOLIC_SERVER}/activity${queryString}`, {
        headers: { Authorization: `bearer ${token}` },
      });
      dispatch({ type: ACTIVITY_GOT_ALL, payload: response.data });
      if (callback) callback(true);
    } catch (err) {
      handleError(ACTIVITY_ERROR)(err, dispatch);
      if (callback) callback(false);
    }
  };
};

export const getActivityLogOwnAction = (userId, number, callback) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const { auth } = state;
      const token = auth.authenticated;
      const queryString = (number) ? `?actionBy=${userId}&number=${number}` : `?actionBy=${userId}`;
      const response = await axios.get(`${MAPOHOLIC_SERVER}/activity${queryString}`, {
        headers: { Authorization: `bearer ${token}` },
      });
      dispatch({ type: ACTIVITY_GOT_OWN, payload: response.data });
      if (callback) callback(true);
    } catch (err) {
      handleError(ACTIVITY_ERROR)(err, dispatch);
      if (callback) callback(false);
    }
  };
};
