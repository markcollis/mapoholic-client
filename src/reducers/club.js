import {
  AUTH_USER,
  CLUB_GOT_LIST,
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

// update club list as necessary for all actions that receive details of an updated club
const getUpdatedClubList = (list, payload) => {
  if (!list) return null;
  const newList = list.map((listedClub) => {
    if (listedClub._id === payload._id) {
      return payload;
    }
    return listedClub;
  });
  return newList;
};

// remove a specific item from a list after deletion
const removeFromListById = (list, id) => {
  if (!list) return null;
  const newList = list.filter((listItem) => listItem._id !== id);
  return newList;
};

const INITIAL_STATE = {
  details: {}, // all club records viewed, key is clubId
  errorMessage: '', // empty unless an error occurs
  list: null, // replaced each time API is queried, also populates corresponding details
  searchField: '', // contents of search box in ClubFilter
  selectedClubId: '', // clubId of club to display in ClubDetails
  selectedEvent: '', // selected event to show details of (eventId)
  selectedMember: '', // selected club member to show details of (userId)
  viewMode: 'none', // configuration of right column: none, view, add, edit, delete
};

const clubReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_USER:
      return INITIAL_STATE; // clear on login or logout
    case CLUB_GOT_LIST: {
      const newDetails = { ...state.details };
      if (action.payload.length > 0) {
        action.payload.forEach((club) => {
          newDetails[club._id] = club;
        });
      }
      return {
        ...state,
        details: newDetails,
        errorMessage: '',
        list: action.payload,
      };
    }
    case CLUB_CREATED:
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        list: getUpdatedClubList([...state.list, { _id: action.payload._id }], action.payload),
        errorMessage: '',
        selectedClubId: action.payload._id,
      };
    case CLUB_UPDATED:
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: action.payload },
        list: getUpdatedClubList(state.list, action.payload),
        errorMessage: '',
      };
    case CLUB_DELETED:
      return {
        ...state,
        details: { ...state.details, [action.payload._id]: null },
        list: removeFromListById(state.list, action.payload._id),
        errorMessage: '',
        selectedClubId: '',
      };
    case CLUB_ERROR:
      return {
        ...state,
        errorMessage: action.payload,
      };
    case CLUB_CHANGE_SEARCH_FIELD:
      return {
        ...state,
        searchField: action.payload,
      };
    case CLUB_CHANGE_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload,
      };
    case CLUB_SELECT_CLUB:
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
      return {
        ...state,
        selectedMember: action.payload,
      };
    case CLUB_SELECT_CLUB_EVENT:
      return {
        ...state,
        selectedEvent: action.payload,
      };
    default:
      return state;
  }
};

export default clubReducer;
