import {
  AUTH_USER,
  EVENT_CHANGE_SEARCH_FIELD_EVENTS,
  EVENT_CHANGE_SEARCH_FIELD_MYMAPS,
  EVENT_CHANGE_TAG_FILTER_EVENTS,
  EVENT_CHANGE_TAG_FILTER_MYMAPS,
  EVENT_CHANGE_VIEW_EVENT_EVENTS,
  EVENT_CHANGE_VIEW_EVENT_LINK,
  EVENT_CHANGE_VIEW_EVENT_MAPVIEW,
  EVENT_CHANGE_VIEW_EVENT_MYMAPS,
  EVENT_CHANGE_VIEW_RUNNER,
  EVENT_COMMENT_ADDED,
  EVENT_COMMENT_DELETED,
  EVENT_COMMENT_UPDATED,
  EVENT_CREATED, // same action whether or not ORIS ref is used
  EVENT_DELETED,
  EVENT_ERROR,
  EVENT_GOT_BY_ID,
  EVENT_GOT_EVENT_LINK_LIST,
  EVENT_GOT_LIST,
  EVENT_GOT_ORIS_LIST,
  EVENT_LINK_CREATED,
  EVENT_LINK_DELETED,
  EVENT_LINK_UPDATED,
  EVENT_MAP_DELETED,
  EVENT_MAP_SET_BOUNDS_EVENTS,
  EVENT_MAP_SET_BOUNDS_MYMAPS,
  EVENT_MAP_UPLOADED,
  EVENT_RUNNER_ADDED,
  EVENT_RUNNER_DELETED,
  EVENT_RUNNER_UPDATED,
  EVENT_SELECT_EVENT_ID_EVENTS,
  EVENT_SELECT_EVENT_ID_MAPVIEW,
  EVENT_SELECT_EVENT_ID_MYMAPS,
  EVENT_SELECT_MAP,
  EVENT_SELECT_RUNNER,
  EVENT_SET_MAP_VIEW_PARAMETERS,
  EVENT_UPDATED,
} from '../actions/types';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"]}] */

// Helper Functions
// update event list as necessary for all actions that receive full details of an updated event
const getUpdatedEventList = (list, payload) => {
  // console.log('getUpdatedEventList list', list, payload);
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
          tags: runner.tags,
        };
      });
      eventDetails.runners = newRunners;
      return eventDetails;
    }
    return listedEvent;
  });
  // console.log('newList:', newList);
  return newList;
};

// remove a specific item (e.g. event/event link) from list after deletion
const removeFromListById = (list, id) => {
  if (!list) return null;
  const newList = list.filter(listItem => listItem._id !== id);
  return newList;
};

const getUpdatedListEventLink = (list, eventLink) => {
  // console.log('updating list:', list, eventLink);
  if (!eventLink) return list;
  const { _id: eventLinkId, displayName, includes } = eventLink;
  const includedIds = includes.map((included => included._id));
  const newList = list.map((eachEvent) => {
    const { _id: eventId, linkedTo } = eachEvent;
    const nowLinked = linkedTo.some(linkedEvent => linkedEvent._id === eventLinkId);
    const shouldBeLinked = includedIds.includes(eventId);
    if (nowLinked && shouldBeLinked) { // replace in case displayName has changed
      const newLinkedTo = linkedTo.map((linkedEvent) => {
        if (linkedEvent._id === eventLinkId) return { _id: eventLinkId, displayName };
        return linkedEvent;
      });
      return { ...eachEvent, linkedTo: newLinkedTo };
    }
    if (!nowLinked && shouldBeLinked) { // add new link to array
      const newLinkedTo = [...linkedTo, { _id: eventLinkId, displayName }];
      return { ...eachEvent, linkedTo: newLinkedTo };
    }
    if (nowLinked && !shouldBeLinked) { // remove from array
      const newLinkedTo = linkedTo.filter(linkedEvent => (linkedEvent._id !== eventLinkId));
      return { ...eachEvent, linkedTo: newLinkedTo };
    }
    return eachEvent; // otherwise do nothing
  });
  return newList;
};

const getUpdatedDetailsEventLink = (details, eventLink) => {
  // console.log('updating details:', details, eventLink);
  if (!eventLink) return details;
  const { _id: eventLinkId, displayName, includes } = eventLink;
  const includedIds = includes.map((included => included._id));
  const newDetails = {};
  const eventIds = Object.keys(details);
  eventIds.forEach((eventId) => {
    const eventLinkedTo = details[eventId].linkedTo;
    const nowLinked = eventLinkedTo.some(linkedEvent => linkedEvent._id === eventLinkId);
    const shouldBeLinked = includedIds.includes(eventId);
    if (nowLinked && shouldBeLinked) { // replace in case displayName has changed
      const newLinkedTo = eventLinkedTo.map((linkedEvent) => {
        if (linkedEvent._id === eventLinkId) return { _id: eventLinkId, displayName };
        return linkedEvent;
      });
      newDetails[eventId] = { ...details[eventId], linkedTo: newLinkedTo };
    } else if (!nowLinked && shouldBeLinked) { // add new link to array
      const newLinkedTo = [...eventLinkedTo, { _id: eventLinkId, displayName }];
      newDetails[eventId] = { ...details[eventId], linkedTo: newLinkedTo };
    } else if (nowLinked && !shouldBeLinked) { // remove from array
      const newLinkedTo = eventLinkedTo.filter(linkedEvent => (linkedEvent._id !== eventLinkId));
      newDetails[eventId] = { ...details[eventId], linkedTo: newLinkedTo };
    } else { // do nothing
      newDetails[eventId] = details[eventId];
    }
  });
  return newDetails;
};

const INITIAL_STATE = {
  // Inputs
  searchFieldEvents: '', // contents of search box in EventHeader (Events view)
  searchFieldMyMaps: '', // contents of search box in EventHeader (MyMaps view)
  tagFilterEvents: '', // contents of tag filter dropdown in EventHeader (Events view)
  tagFilterMyMaps: '', // contents of tag filter dropdown in EventHeader (MyMaps view)
  // Current view modes
  eventLinkMode: 'view', // view, add, edit, delete
  eventModeEvents: 'none', // none, view, add, edit, delete (Events view)
  eventModeMapView: 'view', // view, add, edit, delete (Map view)
  eventModeMyMaps: 'none', // none, view, add, edit, delete (MyMaps view)
  runnerMode: 'view', // none, view, edit, delete
  // Current map view states
  mapBoundsEvents: null, // lat/long coords [[50, 14], [50.2, 14.2]],
  mapBoundsMyMaps: null, // lat/long coords [[50, 14], [50.2, 14.2]],
  mapViewParameters: {}, // view parameters (position, zoom, rotate), key is mapId
  // Ids of items currently being viewed
  selectedEventIdEvents: '', // eventId of event to show details of (Events view)
  selectedEventIdMapView: '', // eventId of event to display maps for
  selectedEventIdMyMaps: '', // eventId of event to show details of (MyMaps view)
  selectedEventLinkId: '', // eventLinkId of event link to edit or delete
  selectedMap: '', // mapId of map to display
  selectedRunner: '', // userId of runner to display maps for
  // API calls
  details: {}, // all event records viewed, key is eventId [includes runners/maps/comments]
  // linkDetails: {}, // all link list records downloaded/updated REDUNDANT
  linkList: null, // replaced each time API is queried
  list: null, // replaced each time API is queried, also populates corresponding details
  orisList: null, // replaced each time API is queried, list specific to current user
  errorMessage: '', // empty unless an error occurs
};

const eventReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // Reset on login or logout
    case AUTH_USER:
      // console.log('AUTH_USER payload:', action.payload);
      return INITIAL_STATE;

    // Inputs
    case EVENT_CHANGE_SEARCH_FIELD_EVENTS:
      // console.log('EVENT_CHANGE_SEARCH_FIELD_EVENTS payload:', action.payload);
      return {
        ...state,
        searchFieldEvents: action.payload,
      };
    case EVENT_CHANGE_SEARCH_FIELD_MYMAPS:
      // console.log('EVENT_CHANGE_SEARCH_FIELD_MYMAPS payload:', action.payload);
      return {
        ...state,
        searchFieldMyMaps: action.payload,
      };
    case EVENT_CHANGE_TAG_FILTER_EVENTS:
      // console.log('EVENT_CHANGE_TAG_FILTER_EVENTS payload:', action.payload);
      return {
        ...state,
        tagFilterEvents: action.payload,
      };
    case EVENT_CHANGE_TAG_FILTER_MYMAPS:
      // console.log('EVENT_CHANGE_TAG_FILTER_MYMAPS payload:', action.payload);
      return {
        ...state,
        tagFilterMyMaps: action.payload,
      };

    // Current view modes
    case EVENT_CHANGE_VIEW_EVENT_LINK: // view mode *and* id
      // console.log('EVENT_CHANGE_VIEW_EVENT_LINK payload:', action.payload);
      return {
        ...state,
        eventLinkMode: action.payload.mode,
        selectedEventLinkId: action.payload.target,
      };
    case EVENT_CHANGE_VIEW_EVENT_EVENTS:
      // console.log('EVENT_CHANGE_VIEW_EVENT_EVENTS payload:', action.payload);
      return {
        ...state,
        eventModeEvents: action.payload,
      };
    case EVENT_CHANGE_VIEW_EVENT_MYMAPS:
      // console.log('EVENT_CHANGE_VIEW_EVENT_MYMAPS payload:', action.payload);
      return {
        ...state,
        eventModeMyMaps: action.payload,
      };
    case EVENT_CHANGE_VIEW_EVENT_MAPVIEW:
      // console.log('EVENT_CHANGE_VIEW_EVENT_MAPVIEW payload:', action.payload);
      return {
        ...state,
        eventModeMapView: action.payload,
      };
    case EVENT_CHANGE_VIEW_RUNNER:
      // console.log('EVENT_CHANGE_VIEW_RUNNER payload:', action.payload);
      return {
        ...state,
        runnerMode: action.payload,
      };

    // Current map view states
    case EVENT_MAP_SET_BOUNDS_EVENTS:
      // console.log('EVENT_MAP_SET_BOUNDS_EVENTS:', action.payload);
      return {
        ...state,
        mapBoundsEvents: action.payload,
      };
    case EVENT_MAP_SET_BOUNDS_MYMAPS:
      // console.log('EVENT_MAP_SET_BOUNDS_MYMAPS:', action.payload);
      return {
        ...state,
        mapBoundsMyMaps: action.payload,
      };
    case EVENT_SET_MAP_VIEW_PARAMETERS:
      // console.log('EVENT_SET_MAP_VIEW_PARAMETERS:', action.payload);
      return {
        ...state,
        mapViewParameters: {
          ...state.mapViewParameters,
          [action.payload.mapId]: action.payload,
        },
      };

    // Ids of items currently being viewed
    case EVENT_SELECT_EVENT_ID_EVENTS:
      // console.log('EVENT_SELECT_EVENT_ID_EVENTS payload:', action.payload);
      return {
        ...state,
        selectedEventIdEvents: action.payload,
      };
    case EVENT_SELECT_EVENT_ID_MYMAPS:
      // console.log('EVENT_SELECT_EVENT_ID_MYMAPS payload:', action.payload);
      return {
        ...state,
        selectedEventIdMyMaps: action.payload,
      };
    case EVENT_SELECT_EVENT_ID_MAPVIEW:
      // console.log('EVENT_SELECT_EVENT_ID_MAPVIEW payload:', action.payload);
      return {
        ...state,
        selectedEventIdMapView: action.payload,
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

    // API calls
      // list: null, // replaced each time API is queried
      // details: {}, // all event records viewed, key is eventId [includes runners/maps/comments]
    case EVENT_GOT_LIST: // populate list (overwrites any earlier version)
      // console.log('EVENT_GOT_LIST payload:', action.payload);
      return {
        ...state,
        errorMessage: '',
        list: action.payload,
      };
    case EVENT_GOT_BY_ID: // update entry in both details and list
      // console.log('EVENT_GOT_BY_ID payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
        list: getUpdatedEventList(state.list, action.payload),
      };
    case EVENT_CREATED: // add to details and list, make currently selected event
      // console.log('EVENT_CREATED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
        selectedEventIdEvents: action.payload._id, // add event suppressed on MyMaps
        list: getUpdatedEventList([...state.list, { // add summary to list
          _id: action.payload._id,
        }], action.payload),
      };
    case EVENT_UPDATED: // update entry in both details and list
    case EVENT_RUNNER_ADDED: // same thing, runner addition returns whole event
    case EVENT_RUNNER_DELETED: // same thing, runner delete returns whole event minus runner
    case EVENT_RUNNER_UPDATED: // same thing, runner update returns whole event
      // console.log('EVENT_UPDATED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
        list: getUpdatedEventList(state.list, action.payload),
      };
    case EVENT_MAP_UPLOADED: // update list and details, including summary data
    case EVENT_MAP_DELETED: { // same actions required
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
    case EVENT_COMMENT_ADDED: // update details entry, list unaffected
    case EVENT_COMMENT_UPDATED:
    case EVENT_COMMENT_DELETED: { // API returns relevant comments array
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
    case EVENT_DELETED: // remove from details and list, clear any current views
      // console.log('EVENT_DELETED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: null },
        errorMessage: '',
        list: removeFromListById(state.list, action.payload._id),
        selectedEventIdEvents: ((state.selectedEventIdEvents === action.payload._id)
          ? ''
          : state.selectedEventIdEvents),
        selectedEventIdMyMaps: ((state.selectedEventIdMyMaps === action.payload._id)
          ? ''
          : state.selectedEventIdMyMaps),
        selectedEventIdMapView: ((state.selectedEventIdMapView === action.payload._id)
          ? ''
          : state.selectedEventIdMapView),
      };

    // linkList: null, // replaced each time API is queried
    case EVENT_GOT_EVENT_LINK_LIST: { // populate linkList
      // console.log('EVENT_GOT_EVENT_LINK_LIST payload:', action.payload);
      return {
        ...state,
        errorMessage: '',
        linkList: action.payload,
      };
    }
    case EVENT_LINK_CREATED: // add new entry to linkList, add to list and details entries
      // console.log('EVENT_LINK_CREATED payload:', action.payload);
      return {
        ...state,
        errorMessage: '',
        linkList: [...state.linkList, action.payload],
        // linkDetails: { ...state.linkDetails, [action.payload._id]: action.payload },
      };
      // *** need to add appropriate updates to details, list and linkedList *** //
    case EVENT_LINK_UPDATED: // replace entry in linkList, update list and details entries
      // console.log('EVENT_LINK_UPDATED payload:', action.payload);
      return {
        ...state,
        linkList: state.linkList.map((link) => {
          if (link._id === action.payload._id) return action.payload;
          return link;
        }),
        list: getUpdatedListEventLink(state.list, action.payload),
        details: getUpdatedDetailsEventLink(state.details, action.payload),
        // linkDetails: { ...state.linkDetails, [action.payload._id]: action.payload },
        errorMessage: '',
      };
      // *** need to add appropriate updates to details, list and linkedList *** //
    case EVENT_LINK_DELETED: // remove entry from linkList,
      // console.log('EVENT_LINK_DELETED payload:', action.payload);
      return {
        ...state,
        // linkDetails: { ...state.linkDetails, [action.payload._id]: null },
        linkList: removeFromListById(state.linkList, action.payload._id),
        errorMessage: '',
        selectedEventLinkId: '',
      };
      // *** need to add appropriate updates to details, list and linkedList *** //

    // orisList: null, // replaced each time API is queried, list specific to current user
    case EVENT_GOT_ORIS_LIST:
      // console.log('EVENT_GOT_ORIS_LIST payload:', action.payload);
      return {
        ...state,
        errorMessage: '',
        orisList: action.payload,
      };

    // errorMessage: '', // empty unless an error occurs
    case EVENT_ERROR:
      // console.log('EVENT_ERROR payload:', action.payload);
      return {
        ...state,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

export default eventReducer;
