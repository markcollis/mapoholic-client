import {
  AUTH_USER,
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
  EVENT_CHANGE_SEARCH_FIELD,
  EVENT_CHANGE_VIEW_EVENT,
  EVENT_CHANGE_VIEW_EVENT_LINK,
  EVENT_CHANGE_VIEW_RUNNER,
  EVENT_SELECT_EVENT_DETAILS,
  EVENT_SELECT_EVENT_DISPLAY,
  EVENT_SELECT_RUNNER,
  EVENT_SELECT_MAP,
} from '../actions/types';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"]}] */

// update event list as necessary for all actions that receive full details of an updated event
const getUpdatedEventList = (list, payload) => {
  if (!list) return null;
  const newList = list.map((listedEvent) => {
    if (listedEvent._id === payload._id) {
      const {
        date,
        linkedTo,
        locCornerNE,
        locCornerSW,
        locCountry,
        locLat,
        locLong,
        locPlace,
        mapName,
        name,
        organisedBy,
        orisId,
        tags,
        types,
        _id,
        runners,
      } = payload;
      const eventDetails = {
        date,
        linkedTo,
        locCornerNE,
        locCornerSW,
        locCountry,
        locLat,
        locLong,
        locPlace,
        mapName,
        name,
        organisedBy,
        orisId,
        tags,
        types,
        _id,
      };
      const newRunners = runners.map((runner) => {
        const mapFiles = [];
        runner.maps.forEach((map) => {
          const { course, route } = map;
          if (course && course !== '') {
            mapFiles.push(course);
          } else if (route && route !== '') {
            mapFiles.push(route);
          }
        });
        const extractName = (mapFiles.length > 0)
          ? mapFiles[0].slice(0, -4).concat('-extract').concat(mapFiles[0].slice(-4))
          : null;
        return {
          user: runner.user._id,
          displayName: runner.user.displayName,
          courseTitle: runner.user.courseTitle,
          numberMaps: runner.maps.length,
          mapExtract: extractName,
        };
      });
      eventDetails.runners = newRunners;
      return eventDetails;
    }
    return listedEvent;
  });
  return newList;
};

// remove an event from list after deletion
const removeEventFromList = (list, eventId) => {
  if (!list) return null;
  const newList = list.filter(listedEvent => listedEvent._id !== eventId);
  return newList;
};

const INITIAL_STATE = {
  searchField: '', // contents of search box in EventFilter
  eventMode: 'none', // none, view, add, edit, delete
  eventLinkMode: 'view', // view, add, edit, delete
  runnerMode: 'view', // none, view, edit, delete
  list: null, // replaced each time API is queried, also populates corresponding details
  linkList: null, // replaced each time API is queried
  linkDetails: {}, // all link list records downloaded/updated
  orisList: null, // replaced each time API is queried, list specific to current user
  details: {}, // all event records viewed, key is eventId [includes runners/maps/comments]
  selectedEventDetails: '', // eventId of event to show details of in list/map view
  selectedEventDisplay: '', // eventId of event to display maps for (can browse events without reset)
  selectedEventLink: '', // eventLinkId of event link to edit or delete
  selectedRunner: '', // userId of runner to display maps for
  selectedMap: '', // mapId of map to display
  errorMessage: '', // empty unless an error occurs
};

const eventReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_USER:
      // console.log('AUTH_USER payload:', action.payload);
      return INITIAL_STATE; // clear on login or logout
    case EVENT_GOT_LIST:
      // console.log('EVENT_GOT_LIST payload:', action.payload);
      return {
        ...state,
        errorMessage: '',
        list: action.payload,
      };
    case EVENT_GOT_EVENT_LINK_LIST: {
      // console.log('EVENT_GOT_EVENT_LINK_LIST payload:', action.payload);
      const newDetails = { ...state.linkListDetails };
      if (action.payload.length > 0) {
        action.payload.forEach((link) => {
          if (link._id) newDetails[link._id] = link;
        });
      }
      return {
        ...state,
        errorMessage: '',
        linkDetails: newDetails,
        linkList: action.payload,
      };
    }
    case EVENT_GOT_ORIS_LIST:
      // console.log('EVENT_GOT_ORIS_LIST payload:', action.payload);
      return {
        ...state,
        errorMessage: '',
        orisList: action.payload,
      };
    case EVENT_GOT_BY_ID:
      // console.log('EVENT_GOT_BY_ID payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
        list: getUpdatedEventList(state.list, action.payload),
      };
    case EVENT_CREATED:
      // console.log('EVENT_CREATED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
        selectedEventDetails: action.payload._id, // selectedEventDisplay as well?
      };
    case EVENT_LINK_CREATED:
      // console.log('EVENT_LINK_CREATED payload:', action.payload);
      return {
        ...state,
        errorMessage: '',
        linkDetails: { ...state.linkDetails, [action.payload._id]: action.payload },
      };
    case EVENT_RUNNER_ADDED:
      // console.log('EVENT_RUNNER_ADDED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
        list: getUpdatedEventList(state.list, action.payload),
      };
    case EVENT_ERROR:
      // console.log('EVENT_ERROR payload:', action.payload);
      return {
        ...state,
        errorMessage: action.payload,
      };
    case EVENT_CHANGE_SEARCH_FIELD:
      // console.log('EVENT_CHANGE_SEARCH_FIELD payload:', action.payload);
      return {
        ...state,
        searchField: action.payload,
      };
    case EVENT_CHANGE_VIEW_EVENT:
      // console.log('EVENT_CHANGE_VIEW_EVENT payload:', action.payload);
      return {
        ...state,
        eventMode: action.payload,
      };
    case EVENT_CHANGE_VIEW_EVENT_LINK:
      // console.log('EVENT_CHANGE_VIEW_EVENT_LINK payload:', action.payload);
      return {
        ...state,
        eventLinkMode: action.payload.mode,
        selectedEventLink: action.payload.target,
      };
    case EVENT_CHANGE_VIEW_RUNNER:
      // console.log('EVENT_CHANGE_VIEW_RUNNER payload:', action.payload);
      return {
        ...state,
        runnerMode: action.payload,
      };
    case EVENT_SELECT_EVENT_DETAILS:
      // console.log('EVENT_SELECT_EVENT_DETAILS payload:', action.payload);
      return {
        ...state,
        selectedEventDetails: action.payload,
      };
    case EVENT_SELECT_EVENT_DISPLAY:
      // console.log('EVENT_SELECT_EVENT_DISPLAY payload:', action.payload);
      return {
        ...state,
        selectedEventDisplay: action.payload,
      };
    case EVENT_SELECT_RUNNER:
      // console.log('EVENT_SELECT_RUNNER payload:', action.payload);
      return {
        ...state,
        selectedRunner: action.payload,
      };
    case EVENT_SELECT_MAP:
      // console.log('EVENT_SELECT_MAP payload:', action.payload);
      return {
        ...state,
        selectedMap: action.payload,
      };
    case EVENT_MAP_DELETED: // same as uploaded, refresh event details record
    case EVENT_MAP_UPLOADED: {
      // console.log('EVENT_MAP_UPLOADED payload:', action.payload);
      const { parameters, updatedEvent } = action.payload;
      const {
        eventId,
        userId,
        mapTitle,
      } = parameters;
      const updatedEventDetails = state.details[eventId];
      updatedEventDetails.locCornerNE = updatedEvent.locCornerNE;
      updatedEventDetails.locCornerSW = updatedEvent.locCornerSW;
      updatedEventDetails.locLat = updatedEvent.locLat;
      updatedEventDetails.locLong = updatedEvent.locLong;
      const runnerToUpdate = updatedEvent.runners.find(runner => runner.user._id === userId);
      const updatedMaps = runnerToUpdate.maps;
      const updatedMap = updatedMaps.find(map => map.title === mapTitle);
      const updatedMapId = (updatedMap) ? updatedMap._id : '';
      updatedEventDetails.runners = state.details[eventId].runners.map((runner) => {
        if (runner.user._id === userId) {
          return { ...runner, maps: updatedMaps };
        }
        return runner;
      });
      return {
        ...state,
        details: {
          ...state.details,
          [eventId]: updatedEventDetails,
        },
        errorMessage: '',
        list: getUpdatedEventList(state.list, updatedEvent),
        selectedMap: updatedMapId,
      };
    }
    case EVENT_UPDATED:
    case EVENT_RUNNER_DELETED: // same thing, runner delete returns whole event minus runner
    case EVENT_RUNNER_UPDATED: // same thing, runner update returns whole event
      // console.log('EVENT_UPDATED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
        list: getUpdatedEventList(state.list, action.payload),
      };
    case EVENT_COMMENT_UPDATED:
    case EVENT_COMMENT_DELETED:
    case EVENT_COMMENT_ADDED: { // API returns relevant comments array
      // console.log('EVENT_COMMENT_ADDED payload:', action.payload);
      const { eventId, userId, comments } = action.payload;
      const runnersInState = state.details[eventId].runners;
      const updatedRunners = runnersInState.map((runner) => {
        return { ...runner };
      }); // copy each runner object
      const runnerToUpdate = updatedRunners
        .find(runner => runner.user._id === userId);
      runnerToUpdate.comments = comments;
      return {
        ...state,
        details: {
          ...state.details,
          [eventId]: {
            ...state.details[eventId],
            runners: updatedRunners,
          },
        },
        errorMessage: '',
      };
    }
    case EVENT_LINK_UPDATED:
      // console.log('EVENT_LINK_UPDATED payload:', action.payload);
      return {
        ...state,
        linkDetails: { ...state.linkDetails, [action.payload._id]: action.payload },
        errorMessage: '',
      };
    case EVENT_DELETED:
      // console.log('EVENT_DELETED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: null },
        errorMessage: '',
        list: removeEventFromList(state.list, action.payload._id),
        selectedEventDetails: '',
      };
    case EVENT_LINK_DELETED:
      // console.log('EVENT_LINK_DELETED payload:', action.payload);
      return {
        ...state,
        linkDetails: { ...state.linkDetails, [action.payload._id]: null },
        errorMessage: '',
        selectedEventLink: '',
      };
    default:
      return state;
  }
};

export default eventReducer;
