import {
  AUTH_USER,
  CLUB_GOT_LIST,
  CLUB_GOT_BY_ID,
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
} from '../actions/types';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"]}] */

const INITIAL_STATE = {
  searchField: '', // contents of search box in ClubFilter
  list: null, // replaced each time API is queried, also populates corresponding details
  viewMode: 'none', // configuration of right column: none, view, add, edit, delete
  details: {}, // all club records viewed, key is clubId
  selectedClubId: '', // clubId of club to display in ClubDetails
  memberLists: {}, // all member list records viewed, key is clubId
  selectedMember: '', // selected club member to show details of (userId)
  eventLists: {}, // all event list records viewed, key is clubId
  selectedEvent: '', // selected event to show details of (eventId)
  errorMessage: '', // empty unless an error occurs
};

const clubReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_USER:
      // console.log('AUTH_USER payload:', action.payload);
      return INITIAL_STATE; // clear on login or logout
    case CLUB_GOT_LIST: {
      // console.log('CLUB_GOT_LIST payload:', action.payload);
      // console.log('details:', state.details);
      const newDetails = { ...state.details };
      if (action.payload.length > 0) {
        action.payload.forEach((club) => {
          newDetails[club._id] = club;
        });
      }
      // console.log('newDetails:', newDetails);
      return {
        ...state,
        details: newDetails,
        errorMessage: '',
        list: action.payload,
      };
    }
    case CLUB_GOT_BY_ID:
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
      };
    case CLUB_CREATED:
      // console.log('CLUB_CREATED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
        selectedClubId: action.payload._id,
      };
    case CLUB_UPDATED:
      // console.log('CLUB_UPDATED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        errorMessage: '',
      };
    case CLUB_DELETED:
      // console.log('CLUB_DELETED payload:', action.payload);
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: null },
        errorMessage: '',
        selectedClubId: '',
      };
    case CLUB_GOT_MEMBERS:
      // console.log('CLUB_GOT_MEMBERS payload:', action.payload);
      return {
        ...state,
        errorMessage: '',
        memberLists: { ...state.memberLists, [action.payload.clubId]: action.payload.memberList },
      };
    case CLUB_GOT_EVENTS:
      // console.log('CLUB_GOT_EVENTS payload:', action.payload);
      return {
        ...state,
        errorMessage: '',
        eventLists: { ...state.eventLists, [action.payload.clubId]: action.payload.eventList },
      };
    case CLUB_ERROR:
      // console.log('CLUB_ERROR payload:', action.payload);
      return {
        ...state,
        errorMessage: action.payload,
      };
    case CLUB_CHANGE_SEARCH_FIELD:
      // console.log('CLUB_CHANGE_SEARCH_FIELD payload:', action.payload);
      return {
        ...state,
        searchField: action.payload,
      };
    case CLUB_CHANGE_VIEW_MODE:
      // console.log('CLUB_CHANGE_VIEW_MODE payload:', action.payload);
      return {
        ...state,
        viewMode: action.payload,
      };
    case CLUB_SELECT_CLUB:
      // console.log('CLUB_SELECT_CLUB payload:', action.payload);
      if (state.selectedClubId === action.payload) {
        return { ...state };
      }
      return {
        ...state,
        selectedClubId: action.payload,
        selectedMember: '', // need to reset on the assumption that selected
        selectedEvent: '', // member and event are not also linked to new selection
      };
    case CLUB_SELECT_CLUB_MEMBER:
      // console.log('CLUB_SELECT_CLUB_MEMBER payload:', action.payload);
      return {
        ...state,
        selectedMember: action.payload,
      };
    case CLUB_SELECT_CLUB_EVENT:
      // console.log('CLUB_SELECT_CLUB_EVENT payload:', action.payload);
      return {
        ...state,
        selectedEvent: action.payload,
      };
    default:
      return state;
  }
};

export default clubReducer;
