// const INITIAL_STATE = {
//   details: {}, // all club records viewed, key is clubId
//   errorMessage: '', // empty unless an error occurs
//   list: null, // replaced each time API is queried, also populates corresponding details
//   searchField: '', // contents of search box in ClubFilter
//   selectedClubId: '', // clubId of club to display in ClubDetails
//   selectedEvent: '', // selected event to show details of (eventId)
//   selectedMember: '', // selected club member to show details of (userId)
//   viewMode: 'none', // configuration of right column: none, view, add, edit, delete
// };

// country: "CZE"
// createdAt: "2019-06-04T11:51:13.539Z"
// fullName: "OK Doksy"
// orisId: "30"
// owner:
// displayName: "MarkC"
// _id: "5cf11c4c4245b2113ddbd002"
// __proto__: Object
// shortName: "DOK"
// updatedAt: "2019-06-04T11:51:13.539Z"
// website: "http://www.ok-doksy.cz"
// _id: "5cf65b31d94840220d

export interface IClubDetails {
  _id: string;
  country: string;
  createdAt: string;
  fullName: string;
  orisId: string;
  owner: {
    displayName: string;
    _id: string;
  };
  shortName: string;
  updatedAt: string;
  website: string;
}

export type ClubDetailsById = {
  [key: string]: IClubDetails
};

export type ClubErrorMessage = string;

export type ClubList = IClubDetails[];

export type ClubSearchField = string;

export type ClubSelectedClubId = string;

export type ClubSelectedEvent = string; // eventId

export type ClubSelectedMember = string; // userId

export enum ClubViewMode {
  None = 'none',
  View = 'view',
  Add = 'add',
  Edit = 'edit',
  Delete = 'delete',
}

export interface IClubState {
  details: ClubDetailsById;
  errorMessage: ClubErrorMessage;
  list: ClubList;
  searchField: ClubSearchField;
  selectedClubId: ClubSelectedClubId;
  selectedEvent: ClubSelectedEvent;
  selectedMember: ClubSelectedMember;
  viewMode: ClubViewMode;
}
