import React, { FunctionComponent, ChangeEventHandler, useState } from 'react';
import { Trans } from '@lingui/macro';

import EventTrackViewer from './EventTrackViewer';
import { calculateDistance } from './leaflet/getPolygonBounds';

import {
  OEvent,
  OEventPosition,
  OEventRunner,
  OEventTrack,
  OEventTrackDetailed,
  OEventTrackPositions,
  OEventWaypoint,
} from '../../types/event';

const TICK = String.fromCodePoint(0x2713);
const CROSS = String.fromCodePoint(0x2715);

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

const getFormattedHeartRateRange = (track: OEventTrackDetailed): string => {
  const heartRates = track
    .map((waypoint) => waypoint.heartRate)
    .filter((heartRate) => !!heartRate) as number[];
  return `${Math.floor(Math.min(...heartRates))}-${Math.floor(Math.max(...heartRates))}`;
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
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);

  const matchingRunner = selectedEvent.runners.find(({ user: { _id } }) => _id === selectedRunner);
  const matchingMaps = (matchingRunner && matchingRunner.maps);
  if (!matchingMaps || !matchingMaps.length) {
    return (
      <div className="event-map-viewer-tracks">
        <h3>{selectedEvent.name}</h3>
        <p><Trans>Please add a map to associate a track with.</Trans></p>
      </div>
    );
  }
  const selectedMap = matchingMaps.find((map) => map._id === selectedMapId);

  const handleSelectMapCheckboxChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newMapId = e.target.checked ? e.target.id : null;
    setSelectedMapId(newMapId);
  };

  const tracksTableRows = matchingMaps.map((map) => {
    const track = (map.geo && map.geo.track) || [];
    const hasTrack = track.length > 0;
    if (!hasTrack) {
      return (
        <tr key={map._id}>
          {matchingMaps.length > 1 && <td>{map.title}</td>}
          <td colSpan={7}><Trans>No track found</Trans></td>
        </tr>
      );
    }
    const hasAltitude = isDetailedTrack(track) && track[0].altitude;
    const hasHeartRate = isDetailedTrack(track) && track[0].heartRate;
    return (
      <tr key={map._id}>
        {matchingMaps.length > 1 && (
          <td>
            <p>
              <input
                id={map._id}
                type="checkbox"
                checked={selectedMapId === map._id}
                onChange={handleSelectMapCheckboxChange}
              />
              <span style={{ paddingLeft: 10 }}>{map.title}</span>
            </p>
          </td>
        )}
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
          {matchingMaps.length > 1 && <th>Map</th>}
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
      {selectedMap && <EventTrackViewer map={selectedMap} />}
      <hr />
      <p>Features to add</p>
      <ul>
        <li>List maps/tracks with basic stats (type, length, waypoint count) - done</li>
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
