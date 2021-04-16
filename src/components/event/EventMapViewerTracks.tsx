/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';

import {
  OEvent,
  OEventPosition,
  OEventRunner,
  OEventTrack,
  OEventTrackDetailed,
  OEventTrackPositions,
  OEventWaypoint,
} from '../../types/event';

import { calculateDistance } from './leaflet/getPolygonBounds';

const TICK = String.fromCodePoint(0x2713);
const CROSS = String.fromCodePoint(0x2715);

const isIdentifiedTrack = (test: IdentifiedTrack | undefined): test is IdentifiedTrack => !!test;

const isDetailedTrack = (
  test: OEventTrackDetailed | OEventTrackPositions,
): test is OEventTrackDetailed => {
  return test.some((point: OEventWaypoint | OEventPosition) => !Array.isArray(point));
};

const getSimpleTrackDistance = (track: OEventTrackPositions): number => { // in metres
  const totalDistance = track.reduce((distance, position, index, array) => {
    if (index === 0) return distance;
    const previousPosition = array[index - 1];
    return distance + calculateDistance(position, previousPosition);
  }, 0);
  return totalDistance;
};

const getDetailedTrackDistance = (track: OEventTrackDetailed): number => { // in metres
  const getPosition = (waypoint: OEventWaypoint): OEventPosition => [waypoint.lat, waypoint.long];
  const totalDistance = track.reduce((distance, waypoint, index, array) => {
    if (index === 0) return distance;
    const previousWaypoint = array[index - 1];
    return distance + calculateDistance(getPosition(waypoint), getPosition(previousWaypoint));
  }, 0);
  return totalDistance;
};

const getTrackDistance = (track: OEventTrack): number => { // in metres
  if (isDetailedTrack(track)) return getDetailedTrackDistance(track);
  return getSimpleTrackDistance(track);
};

const getFormattedTrackDistance = (track: OEventTrack): string => {
  return `${(getTrackDistance(track) / 1000).toFixed(2)} km`;
};

const getTrackClimb = (track: OEventTrackDetailed): number => { // in metres
  const totalClimb = track.reduce((climb, waypoint, index, array) => {
    if (index === 0 || !waypoint.altitude) return climb;
    const previousWaypoint = array[index - 1];
    if (!previousWaypoint.altitude) return climb;
    const additionalClimb = Math.max(0, waypoint.altitude - previousWaypoint.altitude);
    return climb + additionalClimb;
  }, 0);
  return totalClimb;
};

const getFormattedTrackClimb = (track: OEventTrackDetailed): string => {
  return `${Math.floor(getTrackClimb(track))} m`;
};

const getFormattedAltitudeRange = (track: OEventTrackDetailed): string => {
  const altitudes = track
    .map((waypoint) => waypoint.altitude)
    .filter((altitude) => !!altitude) as number[];
  return `${Math.floor(Math.min(...altitudes))}-${Math.floor(Math.max(...altitudes))} m`;
};

// const getFormattedMinimumAltitude = (track: OEventTrackDetailed): string => {
//   const min = Math.min(...track.map((waypoint) => waypoint.altitude || Infinity));
//   return `${Math.floor(min)} m`;
// };

// const getFormattedMaximumAltitude = (track: OEventTrackDetailed): string => {
//   const max = Math.max(...track.map((waypoint) => waypoint.altitude || -Infinity));
//   return `${Math.floor(max)} m`;
// };

const getFormattedHeartRateRange = (track: OEventTrackDetailed): string => {
  const heartRates = track
    .map((waypoint) => waypoint.heartRate)
    .filter((heartRate) => !!heartRate) as number[];
  return `${Math.floor(Math.min(...heartRates))}-${Math.floor(Math.max(...heartRates))}`;
};

type IdentifiedTrack = {
  id: string;
  title: string;
  track: OEventTrack;
};

interface EventMapViewerTracksProps {
  canEdit: boolean;
  selectedEvent: OEvent;
  selectedRunner: string;
  updateEventRunner: (
    eventId: string,
    userId: string,
    payload: Partial<OEventRunner>,
    callback: (didSucceed: boolean) => void,
  ) => void;
}

const EventMapViewerTracks: FunctionComponent<EventMapViewerTracksProps> = ({
  // canEdit,
  selectedEvent,
  selectedRunner,
  // updateEventRunner, // hopefully this can update geo.tracks? need to check API
}) => {
  const matchingRunner = selectedEvent.runners.find(({ user: { _id } }) => _id === selectedRunner);
  const matchingMaps = (matchingRunner && matchingRunner.maps) || [];
  const matchingTracks = matchingMaps
    .map((map) => {
      if (map.geo && map.geo.track && map.geo.track.length) {
        return { id: map._id, title: map.title, track: map.geo.track };
      }
      return undefined;
    })
    .filter(isIdentifiedTrack);
  console.log('matchingTracks', matchingTracks);

  const tracksTableRows = matchingTracks.map(({ id, title, track }) => {
    const hasAltitude = isDetailedTrack(track) && track[0].altitude;
    const hasHeartRate = isDetailedTrack(track) && track[0].heartRate;
    return (
      <tr key={id}>
        {matchingTracks.length > 1 && <td>{title}</td>}
        <td>{track.length}</td>
        <td>{getFormattedTrackDistance(track)}</td>
        <td>{hasAltitude ? getFormattedTrackClimb(track as OEventTrackDetailed) : '-'}</td>
        {hasAltitude
          ? (
            <>
              <td>{TICK}</td>
              <td>{getFormattedAltitudeRange(track as OEventTrackDetailed)}</td>
            </>
          ) : <td colSpan={2}>{CROSS}</td>}
        {hasHeartRate
          ? (
            <>
              <td>{TICK}</td>
              <td>{getFormattedHeartRateRange(track as OEventTrackDetailed)}</td>
            </>
          ) : <td colSpan={2}>{CROSS}</td>}
      </tr>
    );
  });
  const tracksTable = (
    <table className="ui celled sortable unstackable compact small table">
      <thead>
        <tr>
          {matchingTracks.length > 1 && <th>Map</th>}
          <th>Points</th>
          <th>Length (km)</th>
          <th>Climb (m)</th>
          <th colSpan={2}>Altitude data?</th>
          <th colSpan={2}>Heart rate data?</th>
        </tr>
      </thead>
      <tbody>
        {tracksTableRows}
      </tbody>
    </table>
  );
  return (
    <div className="event-map-viewer-tracks">
      <h3>{selectedEvent.name}</h3>
      {tracksTable}
      <hr />
      <p>Features to add</p>
      <ul>
        <li>List maps/tracks with basic stats (type, length, waypoint count)</li>
        <li>Support upload (GPX)</li>
        <li>Trim or delete existing tracks?</li>
        <li>Charts - speed, HR, etc. with either distance or time as X axis</li>
        <li>Add/edit split times (will need data model extension) - is ORIS import possible?</li>
        <li>Exploit split times: e.g. min/km column, distance and climb per leg</li>
      </ul>
    </div>
  );
};

export default EventMapViewerTracks;
