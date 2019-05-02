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
  // EVENT_COMMENT_ADDED, // not yet implemented
  EVENT_UPDATED,
  EVENT_RUNNER_UPDATED,
  EVENT_LINK_UPDATED,
  // EVENT_COMMENT_UPDATED, // not yet implemented
  EVENT_DELETED,
  // EVENT_RUNNER_DELETED, // not yet implemented
  EVENT_MAP_DELETED,
  EVENT_LINK_DELETED,
  // EVENT_COMMENT_DELETED, // not yet implemented
  EVENT_ERROR,
  EVENT_CHANGE_SEARCH_FIELD,
  EVENT_CHANGE_VIEW_EVENT,
  EVENT_CHANGE_VIEW_EVENT_LINK,
  EVENT_CHANGE_VIEW_RUNNER,
  EVENT_CHANGE_VIEW_COURSE_MAP,
  EVENT_CHANGE_VIEW_COMMENT,
  EVENT_SELECT_EVENT_DETAILS,
  EVENT_SELECT_EVENT_DISPLAY,
  EVENT_SELECT_RUNNER,
  EVENT_SELECT_MAP,
} from '../actions/types';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"]}] */

const INITIAL_STATE = {
  searchField: '', // contents of search box in EventFilter
  eventMode: 'none', // none, view, add, edit, delete
  eventLinkMode: 'view', // view, add, edit, delete
  runnerMode: 'view', // view, edit, delete
  courseMapMode: 'view', // view, edit [add/delete functions included in edit]
  commentMode: 'view', // view, add, edit, delete
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
        list: action.payload,
        errorMessage: '',
      };
    case EVENT_GOT_EVENT_LINK_LIST: {
      // console.log('EVENT_GOT_EVENT_LINK_LIST payload:', action.payload);
      const newDetails = { ...state.linkListDetails };
      if (action.payload.length > 0) {
        action.payload.forEach((link) => {
          newDetails[link._id] = link;
        });
      }
      return {
        ...state,
        linkList: action.payload,
        linkDetails: newDetails,
        errorMessage: '',
      };
    }
    case EVENT_GOT_ORIS_LIST:
      // console.log('EVENT_GOT_ORIS_LIST payload:', action.payload);
      return {
        ...state,
        orisList: action.payload,
        errorMessage: '',
      };
    case EVENT_GOT_BY_ID:
      // console.log('EVENT_GOT_BY_ID payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
      };
    case EVENT_CREATED:
      // console.log('EVENT_CREATED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        selectedEventDetails: action.payload._id, // selectedEventDisplay as well?
        errorMessage: '',
      };
    case EVENT_LINK_CREATED:
      // console.log('EVENT_LINK_CREATED payload:', action.payload);
      return {
        ...state,
        linkDetails: { ...state.linkDetails, [action.payload._id]: action.payload },
        errorMessage: '',
      };
    case EVENT_RUNNER_ADDED:
      // console.log('EVENT_RUNNER_ADDED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        list: state.list.map((listedEvent) => {
          if (listedEvent._id === action.payload._id) {
            const updatedEvent = listedEvent;
            updatedEvent.totalRunners = listedEvent.totalRunners + 1;
            return updatedEvent;
          }
          return listedEvent;
        }),
        errorMessage: '',
      };
    case EVENT_ERROR:
      // console.log('EVENT_ERROR payload:', action.payload);
      return { ...state, errorMessage: action.payload };
    case EVENT_CHANGE_SEARCH_FIELD:
      // console.log('EVENT_CHANGE_SEARCH_FIELD payload:', action.payload);
      return { ...state, searchField: action.payload };
    case EVENT_CHANGE_VIEW_EVENT:
      // console.log('EVENT_CHANGE_VIEW_EVENT payload:', action.payload);
      return { ...state, eventMode: action.payload };
    case EVENT_CHANGE_VIEW_EVENT_LINK:
      // console.log('EVENT_CHANGE_VIEW_EVENT_LINK payload:', action.payload);
      return {
        ...state,
        eventLinkMode: action.payload.mode,
        selectedEventLink: action.payload.target,
      };
    case EVENT_CHANGE_VIEW_RUNNER:
      // console.log('EVENT_CHANGE_VIEW_RUNNER payload:', action.payload);
      return { ...state, runnerMode: action.payload };
    case EVENT_CHANGE_VIEW_COURSE_MAP:
      // console.log('EVENT_CHANGE_VIEW_COURSE_MAP payload:', action.payload);
      return { ...state, courseMapMode: action.payload };
    case EVENT_CHANGE_VIEW_COMMENT:
      // console.log('EVENT_CHANGE_VIEW_COMMENT payload:', action.payload);
      return { ...state, commentMode: action.payload };
    case EVENT_SELECT_EVENT_DETAILS:
      // console.log('EVENT_SELECT_EVENT_DETAILS payload:', action.payload);
      return { ...state, selectedEventDetails: action.payload };
    case EVENT_SELECT_EVENT_DISPLAY:
      // console.log('EVENT_SELECT_EVENT_DISPLAY payload:', action.payload);
      return { ...state, selectedEventDisplay: action.payload };
    case EVENT_SELECT_RUNNER:
      // console.log('EVENT_SELECT_RUNNER payload:', action.payload);
      return { ...state, selectedRunner: action.payload };
    case EVENT_SELECT_MAP:
      // console.log('EVENT_SELECT_MAP payload:', action.payload);
      return { ...state, selectedMap: action.payload };
    case EVENT_MAP_DELETED: // same as uploaded, refresh event details record
    case EVENT_MAP_UPLOADED: {
      console.log('EVENT_MAP_UPLOADED payload:', action.payload);
      const { parameters, updatedEvent } = action.payload;
      const {
        eventId,
        userId,
        // mapType,
        mapTitle,
      } = parameters;
      const updatedEventDetails = state.details[eventId];
      updatedEventDetails.locCornerNE = updatedEvent.locCornerNE;
      updatedEventDetails.locCornerSW = updatedEvent.locCornerSW;
      updatedEventDetails.locLat = updatedEvent.locLat;
      updatedEventDetails.locLong = updatedEvent.locLong;
      const updatedMaps = updatedEvent.runners.find(runner => runner.user === userId).maps;
      const updatedMap = updatedMaps.find(map => map.title === mapTitle);
      const updatedMapId = (updatedMap) ? updatedMap._id : '';
      // const updatedMapId = updatedMaps.find(map => map.title === mapTitle)._id;
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
        selectedMap: updatedMapId,
        errorMessage: '',
      };
    }
    case EVENT_UPDATED:
    case EVENT_RUNNER_UPDATED: // same thing, runner update returns whole event
      // console.log('EVENT_UPDATED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
      };
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
        selectedEventDetails: '',
        errorMessage: '',
      };
    case EVENT_LINK_DELETED:
      // console.log('EVENT_LINK_DELETED payload:', action.payload);
      return {
        ...state,
        linkDetails: { ...state.linkDetails, [action.payload._id]: null },
        selectedEventLink: '',
        errorMessage: '',
      };
    default:
      return state;
  }
};

export default eventReducer;
