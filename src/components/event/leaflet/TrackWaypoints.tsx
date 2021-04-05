/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { Polyline } from 'react-leaflet';
import { PathOptions } from 'leaflet';
import Hotline, { HotlineDataPoint, HotlineOptions } from './Hotline';

import {
  OEventTrack,
  OEventTrackDetailed,
  OEventTrackPositions,
  OEventWaypoint,
  OEventPosition,
} from '../../../types/event';

function isDetailedTrack(
  test: OEventTrackDetailed | OEventTrackPositions,
): test is OEventTrackDetailed {
  return test.some((point: OEventWaypoint | OEventPosition) => !Array.isArray(point));
}

interface TrackWaypointProps {
  track: OEventTrack;
  pathOptions?: PathOptions;
  hotline?: {
    hotlineDataType?: string;
    hotlineOptions?: HotlineOptions;
    disable?: boolean;
  };
}

const DEFAULT_PATH_OPTIONS = {
  color: 'red',
};

// simple approximation of distance (in metres) for waypoints that are close together
const calculateDistance = (a: OEventWaypoint, b: OEventWaypoint): number => {
  if (!a || !b) throw new Error('can not calculate distance, invalid waypoints');
  if (Math.abs(a.lat) > 90 || Math.abs(b.lat) > 90
    || Math.abs(a.long) > 180 || Math.abs(b.long) > 180) throw new Error('can not calculate distance, invalid lat/long');
  const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180;

  const RADIUS_EARTH = 6371000;
  const aLat = degreesToRadians(a.lat);
  const aLong = degreesToRadians(a.long);
  const bLat = degreesToRadians(b.lat);
  const bLong = degreesToRadians(b.long);
  const x = (aLong - bLong) * Math.cos((aLat + bLat) / 2);
  const y = aLat - bLat;
  return RADIUS_EARTH * Math.sqrt(x * x + y * y);
};

const getTrackDataSpeed = (track: OEventTrackDetailed): HotlineDataPoint[] => {
  if (track.length < 2) return [];
  const rest = track.slice(1);
  const segmentSpeed = (startWaypoint: OEventWaypoint, endWaypoint: OEventWaypoint): number => {
    const distance = calculateDistance(startWaypoint, endWaypoint); // metres
    const time = endWaypoint.timestamp - startWaypoint.timestamp; // milliseconds
    return 1000 * (distance / time); // -> m/s
  };

  return rest.map((waypoint, index) => [
    waypoint.lat,
    waypoint.long,
    segmentSpeed(track[index], waypoint),
  ]);
};

const getTrackDataMinPerKm = (track: OEventTrackDetailed): HotlineDataPoint[] => {
  const trackDataSpeed = getTrackDataSpeed(track); // in m/s
  return trackDataSpeed.map((dataPoint) => ([
    dataPoint[0],
    dataPoint[1],
    Math.min(1000 / (60 * dataPoint[2]), 20), // convert to min/km
  ]));
};

const getTrackDataAltitude = (track: OEventTrackDetailed): HotlineDataPoint[] => {
  return track.map((waypoint) => [waypoint.lat, waypoint.long, waypoint.altitude || 0]);
};

const getTrackDataHeartRate = (track: OEventTrackDetailed): HotlineDataPoint[] => {
  return track.map((waypoint) => [waypoint.lat, waypoint.long, waypoint.heartRate || 0]);
};

const TrackWaypoints: FunctionComponent<TrackWaypointProps> = ({
  track,
  pathOptions,
  hotline,
}) => {
  if (!track.length) return null;
  if (isDetailedTrack(track)) {
    if (hotline?.disable) {
      const positions: OEventPosition[] = track.map((waypoint) => [waypoint.lat, waypoint.long]);
      return <Polyline positions={positions} pathOptions={pathOptions || DEFAULT_PATH_OPTIONS} />;
    }
    let data: HotlineDataPoint[] = [];
    const options: HotlineOptions = hotline?.hotlineOptions || {};
    const dataType = hotline?.hotlineDataType || 'speed';
    if (dataType === 'altitude') {
      data = getTrackDataAltitude(track);
    }
    if (dataType === 'heartRate') {
      data = getTrackDataHeartRate(track);
    }
    if (dataType === 'minPerKm') {
      data = getTrackDataMinPerKm(track);
    }
    if (dataType === 'speed') {
      data = getTrackDataSpeed(track);
      if (!('palette' in options)) {
        options.palette = { // reverse, red = slow
          0.0: '#ff0000',
          0.5: '#ffff00',
          1.0: '#008800',
        };
      }
    }
    return <Hotline data={data} options={options} />;
  }
  return <Polyline positions={track} pathOptions={pathOptions || DEFAULT_PATH_OPTIONS} />;
};

export default TrackWaypoints;
