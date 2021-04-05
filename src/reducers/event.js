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

// Helper Functions
// update event list as necessary for all actions that receive full details of an updated event
const getUpdatedEventList = (list, payload) => {
  if (!list) return null;
  const newList = list.map((listedEvent) => {
    if (listedEvent._id === payload._id) {
      const {
        date,
        linkedTo,
        locCornerNE,
        locCornerNW,
        locCornerSW,
        locCornerSE,
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
        locCornerNW,
        locCornerSW,
        locCornerSE,
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
        const ownTracks = [];
        const ownMapCorners = [];
        runner.maps.forEach((map) => {
          const { course, route, geo } = map;
          if (course && course !== '') {
            mapFiles.push(course);
          } else if (route && route !== '') {
            mapFiles.push(route);
          }
          if (geo && geo.track && geo.track.length) {
            ownTracks.push(geo.track);
          }
          if (geo && geo.mapCorners) {
            ownMapCorners.push(geo.mapCorners);
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
          ownTracks,
          ownMapCorners,
        };
      });
      eventDetails.runners = newRunners;
      return eventDetails;
    }
    return listedEvent;
  });
  return newList;
};

// remove a specific item (e.g. event/event link) from list after deletion
const removeFromListById = (list, id) => {
  if (!list) return null;
  const newList = list.filter((listItem) => listItem._id !== id);
  return newList;
};

const getUpdatedLinkListEvent = (linkList, oevent) => {
  if (!oevent) return linkList;
  const {
    _id: eventId,
    date,
    name,
    linkedTo,
  } = oevent;
  if (!linkedTo) return linkList;
  const linkedToIds = linkedTo.map(((link) => link._id));
  const newLinkList = linkList.map((eachLink) => {
    const { _id: eventLinkId, includes } = eachLink;
    const nowLinked = includes.some((linkedEvent) => linkedEvent._id === eventId);
    const shouldBeLinked = linkedToIds.includes(eventLinkId);
    if (nowLinked && shouldBeLinked) { // replace in case name or date have changed
      const newIncludes = includes.map((linkedEvent) => {
        if (linkedEvent._id === eventLinkId) return { _id: eventId, date, name };
        return linkedEvent;
      });
      return { ...eachLink, includes: newIncludes };
    }
    if (!nowLinked && shouldBeLinked) { // add new link to array
      const newIncludes = [...includes, { _id: eventId, date, name }];
      return { ...eachLink, includes: newIncludes };
    }
    if (nowLinked && !shouldBeLinked) { // remove from array
      const newIncludes = includes.filter((linkedEvent) => (linkedEvent._id !== eventId));
      return { ...eachLink, includes: newIncludes };
    }
    return eachLink; // otherwise do nothing
  });
  return newLinkList;
};

const getUpdatedListEventLink = (list, eventLink) => {
  if (!eventLink) return list;
  const { _id: eventLinkId, displayName, includes } = eventLink;
  if (!includes) return list;
  const includedIds = includes.map(((included) => included._id));
  const newList = list.map((eachEvent) => {
    const { _id: eventId, linkedTo } = eachEvent;
    if (!linkedTo) return eachEvent;
    const nowLinked = linkedTo.some((link) => link._id === eventLinkId);
    const shouldBeLinked = includedIds.includes(eventId);
    if (nowLinked && shouldBeLinked) { // replace in case displayName has changed
      const newLinkedTo = linkedTo.map((link) => {
        if (link._id === eventLinkId) return { _id: eventLinkId, displayName };
        return link;
      });
      return { ...eachEvent, linkedTo: newLinkedTo };
    }
    if (!nowLinked && shouldBeLinked) { // add new link to array
      const newLinkedTo = [...linkedTo, { _id: eventLinkId, displayName }];
      return { ...eachEvent, linkedTo: newLinkedTo };
    }
    if (nowLinked && !shouldBeLinked) { // remove from array
      const newLinkedTo = linkedTo.filter((link) => (link._id !== eventLinkId));
      return { ...eachEvent, linkedTo: newLinkedTo };
    }
    return eachEvent; // otherwise do nothing
  });
  return newList;
};

const getUpdatedListEventLinkDeleted = (list, eventLinkId) => {
  if (!eventLinkId) return list;
  const newList = list.map((eachEvent) => {
    const { linkedTo } = eachEvent;
    if (!linkedTo) return eachEvent;
    const nowLinked = linkedTo.some((link) => link._id === eventLinkId);
    if (nowLinked) { // remove from array
      const newLinkedTo = linkedTo.filter((link) => (link._id !== eventLinkId));
      return { ...eachEvent, linkedTo: newLinkedTo };
    }
    return eachEvent; // otherwise do nothing
  });
  return newList;
};

const getUpdatedDetailsEventLink = (details, eventLink) => {
  if (!eventLink) return details;
  const { _id: eventLinkId, displayName, includes } = eventLink;
  if (!includes) return details;
  const includedIds = includes.map(((included) => included._id));
  const newDetails = {};
  const eventIds = Object.keys(details);
  eventIds.forEach((eventId) => {
    const eventDetails = details[eventId];
    const { linkedTo: eventLinkedTo } = eventDetails;
    const nowLinked = eventLinkedTo
      && eventLinkedTo.some((linkedEvent) => linkedEvent._id === eventLinkId);
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
      const newLinkedTo = eventLinkedTo.filter((linkedEvent) => (linkedEvent._id !== eventLinkId));
      newDetails[eventId] = { ...details[eventId], linkedTo: newLinkedTo };
    } else { // do nothing
      newDetails[eventId] = details[eventId];
    }
  });
  return newDetails;
};

const getUpdatedDetailsEventLinkDeleted = (details, eventLinkId) => {
  if (!eventLinkId) return details;
  const newDetails = {};
  const eventIds = Object.keys(details);
  eventIds.forEach((eventId) => {
    const eventDetails = details[eventId];
    const { linkedTo: eventLinkedTo } = eventDetails;
    const nowLinked = eventLinkedTo
      && eventLinkedTo.some((eventLink) => eventLink._id === eventLinkId);
    if (nowLinked) { // remove from array
      const newLinkedTo = eventLinkedTo.filter((eventLink) => (eventLink._id !== eventLinkId));
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
  linkList: null, // replaced each time API is queried
  list: null, // replaced each time API is queried, also populates corresponding details
  orisList: null, // replaced each time API is queried, list specific to current user
  errorMessage: '', // empty unless an error occurs
};

const eventReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // Reset on login or logout
    case AUTH_USER:
      return INITIAL_STATE;

    // Inputs
    case EVENT_CHANGE_SEARCH_FIELD_EVENTS:
      return {
        ...state,
        searchFieldEvents: action.payload,
      };
    case EVENT_CHANGE_SEARCH_FIELD_MYMAPS:
      return {
        ...state,
        searchFieldMyMaps: action.payload,
      };
    case EVENT_CHANGE_TAG_FILTER_EVENTS:
      return {
        ...state,
        tagFilterEvents: action.payload,
      };
    case EVENT_CHANGE_TAG_FILTER_MYMAPS:
      return {
        ...state,
        tagFilterMyMaps: action.payload,
      };

    // Current view modes
    case EVENT_CHANGE_VIEW_EVENT_LINK: // view mode *and* id
      return {
        ...state,
        eventLinkMode: action.payload.mode,
        selectedEventLinkId: action.payload.target,
      };
    case EVENT_CHANGE_VIEW_EVENT_EVENTS:
      return {
        ...state,
        eventModeEvents: action.payload,
      };
    case EVENT_CHANGE_VIEW_EVENT_MYMAPS:
      return {
        ...state,
        eventModeMyMaps: action.payload,
      };
    case EVENT_CHANGE_VIEW_EVENT_MAPVIEW:
      return {
        ...state,
        eventModeMapView: action.payload,
      };
    case EVENT_CHANGE_VIEW_RUNNER:
      return {
        ...state,
        runnerMode: action.payload,
      };

    // Current map view states
    case EVENT_MAP_SET_BOUNDS_EVENTS:
      return {
        ...state,
        mapBoundsEvents: action.payload,
      };
    case EVENT_MAP_SET_BOUNDS_MYMAPS:
      return {
        ...state,
        mapBoundsMyMaps: action.payload,
      };
    case EVENT_SET_MAP_VIEW_PARAMETERS:
      return {
        ...state,
        mapViewParameters: {
          ...state.mapViewParameters,
          [action.payload.mapId]: action.payload,
        },
      };

    // Ids of items currently being viewed
    case EVENT_SELECT_EVENT_ID_EVENTS:
      return {
        ...state,
        selectedEventIdEvents: action.payload,
      };
    case EVENT_SELECT_EVENT_ID_MYMAPS:
      return {
        ...state,
        selectedEventIdMyMaps: action.payload,
      };
    case EVENT_SELECT_EVENT_ID_MAPVIEW:
      return {
        ...state,
        selectedEventIdMapView: action.payload,
        eventModeMapView: 'view',
        runnerMode: 'view',
      };
    case EVENT_SELECT_RUNNER:
      return {
        ...state,
        selectedRunner: action.payload,
      };
    case EVENT_SELECT_MAP:
      return {
        ...state,
        selectedMap: action.payload,
      };

    // API calls
      // list: null, // replaced each time API is queried
      // details: {}, // all event records viewed, key is eventId [includes runners/maps/comments]
    case EVENT_GOT_LIST: // populate list (overwrites any earlier version)
      return {
        ...state,
        errorMessage: '',
        list: action.payload,
      };
    case EVENT_GOT_BY_ID: // update entry in both details and list
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
        list: getUpdatedEventList(state.list, action.payload),
      };
    case EVENT_CREATED: // add to details and list, make currently selected event
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
        selectedEventIdEvents: action.payload._id, // add event suppressed on MyMaps
        list: getUpdatedEventList([...state.list, { // add summary to list
          _id: action.payload._id,
        }], action.payload),
      };
    case EVENT_UPDATED: // update entry in both details and list, fix linkList if required
    case EVENT_RUNNER_ADDED: // same thing, runner addition returns whole event
    case EVENT_RUNNER_DELETED: // same thing, runner delete returns whole event minus runner
    case EVENT_RUNNER_UPDATED: // same thing, runner update returns whole event
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
        linkList: getUpdatedLinkListEvent(state.linkList, action.payload),
        list: getUpdatedEventList(state.list, action.payload),
      };
    case EVENT_MAP_UPLOADED: // update list and details, including summary data
    case EVENT_MAP_DELETED: { // same actions required
      const { parameters, updatedEvent } = action.payload;
      const {
        eventId,
        userId,
        mapTitle,
      } = parameters;
      const updatedEventDetails = { ...state.details[eventId] };
      updatedEventDetails.locCornerNE = updatedEvent.locCornerNE;
      updatedEventDetails.locCornerNW = updatedEvent.locCornerNW;
      updatedEventDetails.locCornerSW = updatedEvent.locCornerSW;
      updatedEventDetails.locCornerSE = updatedEvent.locCornerSE;
      updatedEventDetails.locLat = updatedEvent.locLat;
      updatedEventDetails.locLong = updatedEvent.locLong;
      const runnerToUpdate = updatedEvent.runners.find((runner) => runner.user._id === userId);
      const updatedMaps = runnerToUpdate.maps;
      const updatedMap = updatedMaps.find((map) => map.title === mapTitle);
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
      const { eventId, userId, comments } = action.payload;
      const runnersInState = state.details[eventId].runners;
      const updatedRunners = runnersInState.map((runner) => {
        return { ...runner };
      }); // copy each runner object
      const runnerToUpdate = updatedRunners
        .find((runner) => runner.user._id === userId);
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
    case EVENT_DELETED: // remove from details and list, clear any current views,
      // fix linkList if required
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: null },
        errorMessage: '',
        linkList: getUpdatedLinkListEvent(state.linkList, { ...action.payload, linkedTo: [] }),
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
      return {
        ...state,
        errorMessage: '',
        linkList: action.payload,
      };
    }
    case EVENT_LINK_CREATED: // add new entry to linkList, add to list and details entries
      return {
        ...state,
        details: getUpdatedDetailsEventLink(state.details, action.payload),
        errorMessage: '',
        linkList: [...state.linkList, action.payload],
        list: getUpdatedListEventLink(state.list, action.payload),
      };
      // *** need to add appropriate updates to details, list and linkedList *** //
    case EVENT_LINK_UPDATED: // replace entry in linkList, update list and details entries
      return {
        ...state,
        details: getUpdatedDetailsEventLink(state.details, action.payload),
        errorMessage: '',
        linkList: state.linkList.map((link) => {
          if (link._id === action.payload._id) return action.payload;
          return link;
        }),
        list: getUpdatedListEventLink(state.list, action.payload),
      };
      // *** need to add appropriate updates to details, list and linkedList *** //
    case EVENT_LINK_DELETED: // remove entry from linkList,
      return {
        ...state,
        details: getUpdatedDetailsEventLinkDeleted(state.details, action.payload._id),
        errorMessage: '',
        linkList: removeFromListById(state.linkList, action.payload._id),
        list: getUpdatedListEventLinkDeleted(state.list, action.payload._id),
        selectedEventLinkId: '',
      };
      // *** need to add appropriate updates to details, list and linkedList *** //

    // orisList: null, // replaced each time API is queried, list specific to current user
    case EVENT_GOT_ORIS_LIST:
      return {
        ...state,
        errorMessage: '',
        orisList: action.payload,
      };

    // errorMessage: '', // empty unless an error occurs
    case EVENT_ERROR:
      return {
        ...state,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

export default eventReducer;
