/* eslint-disable max-len */
// sample event
// {
//   "_id": {"$oid":"6057b45a4f56e42a2f6b2d17"},
//   "organisedBy":[{"$oid":"5cf65b31d94840220da58c07"}],
//   "linkedTo":[],
//   "locRegions":["P"],
//   "locCornerSW":[50.09750638888889,14.318988333333333],
//   "locCornerNW":[50.110951666666665,14.318733333333334],
//   "locCornerNE":[50.111178055555555,14.348210833333333],
//   "locCornerSE":[50.0977325,14.3484575],
//   "types":["Middle"],
//   "tags":["Training"],
//   "active":true,
//   "owner":{"$oid":"5cf11c4c4245b2113ddbd002"},
//   "name":"Solo Training (Nebušice)",
//   "date":"2020-10-31",
//   "mapName":"Šárka",
//   "locPlace":"Praha",
//   "locLat":50.1067,
//   "locLong":14.3255,
//   "website":"",
//   "results":"",
//   "locCountry":"CZE",
//   "runners":[{
//     "visibility":"all",
//     "tags":[],
//     "_id":{"$oid":"6057b45c4f56e42a2f6b2d19"},
//     "user":{"$oid":"5cf11c4c4245b2113ddbd002"},
//     "fullResults":[],
//     "maps":[
//       {"geo":{
//         "mapCentre":{"lat":50.104342152777775,"long":14.333597500000002},
//         "mapCorners":{"sw":{"lat":50.09750638888889,"long":14.318988333333333},"nw":{"lat":50.110951666666665,"long":14.318733333333334},"ne":{"lat":50.111178055555555,"long":14.348210833333333},"se":{"lat":50.0977325,"long":14.3484575}},
//         "imageCorners":{"sw":{"lat":50.097498888888886,"long":14.318976666666666},"nw":{"lat":50.11145277777778,"long":14.318711944444445},"ne":{"lat":50.11167916666667,"long":14.348213333333334},"se":{"lat":50.097725,"long":14.348469444444444}},
//         "locationSizePixels":{"x":1,"y":66,"width":2490,"height":1771},
//         "track":[
//           {"lat":50.10610444444445,"long":14.3262975,"timestamp":1604128800000,"altitude":345},
//           {"lat":50.10609777777778,"long":14.32626138888889,"timestamp":1604128804000,"altitude":345},
//           {"lat":50.10611277777778,"long":14.326070833333333,"timestamp":1604128810000,"altitude":346},
//           {"lat":50.106139166666665,"long":14.325911388888889,"timestamp":1604128814000,"altitude":347},
//           {"lat":50.10610944444444,"long":14.325669444444445,"timestamp":1604128821000,"altitude":348},
//           etc., etc.,
//           {"lat":50.10614694444445,"long":14.326705,"timestamp":1604132365000,"altitude":343}
//         ],
//         "distanceRun":"5.318"
//       },
//       "title":"",
//       "isGeocoded":true,
//       "_id":{"$oid":"6057b7c24f56e42a2f6b2d38"},
//       "route":"images/maps/6057b45a4f56e42a2f6b2d17/5cf11c4c4245b2113ddbd002-map-route.jpg",
//       "routeUpdated":"1617047869288",
//       "course":"images/maps/6057b45a4f56e42a2f6b2d17/5cf11c4c4245b2113ddbd002-map-course.jpg",
//       "courseUpdated":"1616361447311",
//       "overlay":"images/maps/6057b45a4f56e42a2f6b2d17/5cf11c4c4245b2113ddbd002-map-overlay.png",
//       "overlayUpdated":"1617047869288"
//       }
//     ],
//     "comments":[],
//     "courseClimb":"",
//     "courseControls":"18",
//     "courseLength":"4.1",
//     "courseTitle":"Dlouhá",
//     "fieldSize":"",
//     "place":"",
//     "time":"59:26",
//     "timeBehind":""
//   }],
//   "createdAt":{"$date":"2021-03-21T21:02:18.236Z"},
//   "updatedAt":{"$date":"2021-03-29T19:57:49.295Z"},
//   "__v":0
// }

import { User } from './user';

export interface OEventCoordinates {
  lat: number;
  long: number;
}

export interface OEventWaypoint extends OEventCoordinates {
  timestamp: number;
  altitude?: number;
  heartRate?: number;
}

type FixedTwoArray<T> = [T, T];

export type OEventPosition = FixedTwoArray<number>; // specifically lat, long

export interface OEventCorners {
  ne: OEventCoordinates;
  nw: OEventCoordinates;
  se: OEventCoordinates;
  sw: OEventCoordinates;
}

export interface OEventLocationSize {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type OEventTrackDetailed = OEventWaypoint[];
export type OEventTrackPositions = OEventPosition[];
export type OEventTrack = OEventTrackDetailed | OEventTrackPositions;
// newly imported tracks will have full details in mongo, older ones may have positions only

export interface OEventMapGeoData {
  mapCentre: OEventCoordinates;
  mapCorners: OEventCorners;
  imageCorners: OEventCorners;
  locationSizePixels: OEventLocationSize;
  track: OEventTrack;
  distanceRun: string;
}

export interface OEventMap {
  _id: string;
  isGeocoded: boolean;
  geo?: OEventMapGeoData;
  title: string;
  route: string;
  routeUpdated: string;
  course: string;
  courseUpdated: string;
  overlay: string;
  overlayUpdated: string;
}

export interface OEventRunner {
  _id: string;
  maps: OEventMap[];
  user: User;
  courseTitle: string;
  // other stuff to add
}

export interface OEvent {
  _id: string;
  locLat: number | null;
  locLong: number | null;
  locCornerNE: OEventPosition;
  locCornerNW: OEventPosition;
  locCornerSE: OEventPosition;
  locCornerSW: OEventPosition;
  runners: OEventRunner[];
  name: string;
  owner: { // user
    _id: string;
    displayName: string;
  },
  // other stuff to add
}

export interface OEventSummaryRunner {
  user: string;
  displayName: string;
  mapExtract: string;
  numberMaps: number;
  tags: string[];
  ownTracks: OEventTrack[];
  ownMapCorners: OEventCorners[];
}

// GET /events returns a reduced summary of each event
// (might want to replace track with positions to reduce size)
export interface OEventSummary {
  _id: string;
  date: string;
  locLat: number | null;
  locLong: number | null;
  locCornerNE: OEventPosition;
  locCornerNW: OEventPosition;
  locCornerSE: OEventPosition;
  locCornerSW: OEventPosition;
  locCountry: string;
  locPlace: string;
  name: string;
  mapName: string;
  orisId: string;
  runners: OEventSummaryRunner[];
  tags: string[];
  types: string[];
  organisedBy: Array<{ // club
    _id: string;
    shortName: string;
  }>;
  linkedTo: Array<{ // event
    _id: string;
    displayName: string;
  }>;
}
